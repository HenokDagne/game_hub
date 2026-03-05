import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createManagedGame,
  deleteManagedGame,
  listManagedGames,
  updateManagedGame,
} from "@/lib/admin-content-store";
import { getSafeServerSession } from "@/lib/session";

const payloadSchema = z.object({
  title: z.string().trim().min(2).max(100),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  platform: z.string().trim().min(2).max(50),
  categories: z.array(z.string().trim().min(1)).max(20),
  tags: z.array(z.string().trim().min(1)).max(30),
  featured: z.boolean(),
  trending: z.boolean(),
});

const putSchema = payloadSchema.extend({
  id: z.string().min(1),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

async function assertAdmin() {
  const session = await getSafeServerSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    return false;
  }

  return true;
}

export async function GET() {
  const isAdmin = await assertAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ games: listManagedGames() });
}

export async function POST(request: Request) {
  const isAdmin = await assertAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = payloadSchema.parse(body);

    const game = createManagedGame(parsed);

    return NextResponse.json({ game }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ error: "Could not create game" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAdmin = await assertAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = putSchema.parse(body);

    const updated = updateManagedGame(parsed.id, {
      title: parsed.title,
      status: parsed.status,
      platform: parsed.platform,
      categories: parsed.categories,
      tags: parsed.tags,
      featured: parsed.featured,
      trending: parsed.trending,
    });

    if (!updated) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({ game: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ error: "Could not update game" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAdmin = await assertAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = deleteSchema.parse(body);

    const deleted = deleteManagedGame(parsed.id);

    if (!deleted) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ error: "Could not delete game" }, { status: 500 });
  }
}
