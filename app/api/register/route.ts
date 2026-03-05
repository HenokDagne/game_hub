import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const DEFAULT_PROFILE_IMAGE = "/profile.png";
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

class BadRequestError extends Error {}

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((value) => (value.length ? value : undefined))
    .optional()
    .refine((value) => value === undefined || (value.length >= 2 && value.length <= 50), {
      message: "Name must be between 2 and 50 characters",
    }),
  email: z.string().trim().email(),
  password: z.string().min(6),
});

async function getRegisterPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const profileImage = formData.get("profileImage");

    return {
      name: typeof name === "string" ? name : undefined,
      email: typeof email === "string" ? email : "",
      password: typeof password === "string" ? password : "",
      profileImage: profileImage instanceof File ? profileImage : null,
    };
  }

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  return {
    name: body.name,
    email: body.email ?? "",
    password: body.password ?? "",
    profileImage: null,
  };
}

async function saveProfileImage(file: File | null) {
  if (!file || file.size === 0) {
    return DEFAULT_PROFILE_IMAGE;
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new BadRequestError("Profile image must be JPEG, PNG, WEBP, or GIF");
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    throw new BadRequestError("Profile image size must be 5MB or less");
  }

  const extensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  const extension = extensionMap[file.type] ?? "png";
  const fileName = `${randomUUID()}.${extension}`;
  const uploadDirectory = join(process.cwd(), "public", "uploads", "profiles");
  const outputPath = join(uploadDirectory, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(outputPath, fileBuffer);

  return `/uploads/profiles/${fileName}`;
}

export async function POST(request: Request) {
  try {
    const payload = await getRegisterPayload(request);
    const parsed = registerSchema.parse({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });
    const profileImage = await saveProfileImage(payload.profileImage);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 12);

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashedPassword,
        profileImage,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        role: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Register API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2022") {
      return NextResponse.json(
        { error: "Database schema is out of date. Run Prisma migrations and try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Could not create account" }, { status: 500 });
  }
}
