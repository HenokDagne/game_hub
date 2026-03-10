import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ProfileImageValidationError, saveProfileImage } from "@/lib/profile-image-upload";

const registerSchema = z
  .object({
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
    confirmPassword: z.string().min(6),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

async function getRegisterPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const profileImage = formData.get("profileImage");

    return {
      name: typeof name === "string" ? name : undefined,
      email: typeof email === "string" ? email : "",
      password: typeof password === "string" ? password : "",
      confirmPassword: typeof confirmPassword === "string" ? confirmPassword : "",
      profileImage: profileImage instanceof File ? profileImage : null,
    };
  }

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  return {
    name: body.name,
    email: body.email ?? "",
    password: body.password ?? "",
    confirmPassword: body.confirmPassword ?? "",
    profileImage: null,
  };
}

export async function POST(request: Request) {
  try {
    const payload = await getRegisterPayload(request);
    const parsed = registerSchema.parse({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
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

    if (error instanceof ProfileImageValidationError) {
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
