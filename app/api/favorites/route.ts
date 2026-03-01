import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSafeServerSession } from "@/lib/session";

const favoriteSchema = z.object({
  gameId: z.string().min(1),
  title: z.string().min(1),
  image: z.string().url().nullable().optional(),
});

export async function GET() {
  const session = await getSafeServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const session = await getSafeServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = favoriteSchema.parse(body);

    const existing = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        gameId: parsed.gameId,
      },
    });

    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        gameId: parsed.gameId,
        title: parsed.title,
        image: parsed.image,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
