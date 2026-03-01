import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSafeServerSession } from "@/lib/session";

type Params = {
  params: Promise<{ gameId: string }>;
};

export async function DELETE(_: Request, { params }: Params) {
  const session = await getSafeServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gameId } = await params;

  await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      gameId,
    },
  });

  return NextResponse.json({ ok: true });
}
