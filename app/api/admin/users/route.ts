import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSafeServerSession } from "@/lib/session";

type BaseRole = "USER" | "ADMIN";
type UserStatus = "ACTIVE" | "SUSPENDED";

function parseBaseRole(role: string): BaseRole {
  if (role === "ADMIN" || role === "SUSPENDED_ADMIN") {
    return "ADMIN";
  }

  return "USER";
}

function parseStatus(role: string): UserStatus {
  return role.startsWith("SUSPENDED_") ? "SUSPENDED" : "ACTIVE";
}

const patchSchema = z.object({
  userId: z.string().min(1),
  action: z.enum(["promote", "demote", "suspend", "reactivate"]),
});

const putSchema = z.object({
  userId: z.string().min(1),
  name: z
    .string()
    .trim()
    .max(50)
    .transform((value) => (value.length ? value : null))
    .nullable(),
  email: z.string().trim().email(),
});

const deleteSchema = z.object({
  userId: z.string().min(1),
});

export async function GET(request: Request) {
  const session = await getSafeServerSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
  const roleFilter = (url.searchParams.get("role") ?? "ALL").toUpperCase();
  const statusFilter = (url.searchParams.get("status") ?? "ALL").toUpperCase();

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      role: true,
      createdAt: true,
    },
  });

  const normalizedUsers = users
    .map((user) => ({
      ...user,
      baseRole: parseBaseRole(user.role),
      status: parseStatus(user.role),
    }))
    .filter((user) => {
      if (user.baseRole === "ADMIN") {
        return false;
      }

      if (search) {
        const name = (user.name ?? "").toLowerCase();
        const email = user.email.toLowerCase();

        if (!name.includes(search) && !email.includes(search)) {
          return false;
        }
      }

      if (roleFilter !== "ALL" && user.baseRole !== roleFilter) {
        return false;
      }

      if (statusFilter !== "ALL" && user.status !== statusFilter) {
        return false;
      }

      return true;
    });

  return NextResponse.json({ users: normalizedUsers });
}

export async function PATCH(request: Request) {
  const session = await getSafeServerSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, action } = patchSchema.parse(body);

    if (session.user.id === userId) {
      return NextResponse.json({ error: "You cannot modify your own account" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let nextRole = user.role;

    switch (action) {
      case "promote": {
        if (user.role === "USER") {
          nextRole = "ADMIN";
        }
        break;
      }
      case "demote": {
        if (user.role === "ADMIN") {
          nextRole = "USER";
        }
        break;
      }
      case "suspend": {
        if (user.role === "ADMIN") {
          nextRole = "SUSPENDED_ADMIN";
        } else if (user.role === "USER") {
          nextRole = "SUSPENDED_USER";
        }
        break;
      }
      case "reactivate": {
        if (user.role === "SUSPENDED_ADMIN") {
          nextRole = "ADMIN";
        } else if (user.role === "SUSPENDED_USER") {
          nextRole = "USER";
        }
        break;
      }
      default: {
        break;
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: nextRole },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      user: {
        ...updated,
        baseRole: parseBaseRole(updated.role),
        status: parseStatus(updated.role),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ error: "Could not update user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSafeServerSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, name, email } = putSchema.parse(body);

    if (session.user.id === userId) {
      return NextResponse.json({ error: "You cannot modify your own account here" }, { status: 400 });
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "ADMIN" || target.role === "SUSPENDED_ADMIN") {
      return NextResponse.json({ error: "Admin users cannot be edited here" }, { status: 403 });
    }

    const emailOwner = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailOwner && emailOwner.id !== userId) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      user: {
        ...updated,
        baseRole: parseBaseRole(updated.role),
        status: parseStatus(updated.role),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ error: "Could not update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSafeServerSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId } = deleteSchema.parse(body);

    if (session.user.id === userId) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "ADMIN" || target.role === "SUSPENDED_ADMIN") {
      return NextResponse.json({ error: "Admin users cannot be deleted" }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.favorite.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ error: "Could not delete user" }, { status: 500 });
  }
}
