import { NextResponse } from "next/server";
import { z } from "zod";
import { getSafeServerSession } from "@/lib/session";
import {
  getBasicUser,
  getProfilePayload,
  hasExtendedProfileModels,
  isMissingTableError,
  ProfileInputError,
  updateProfilePayload,
  withDefaultExtendedPayload,
} from "./profile-service";
import { updateSchema } from "./validation";

export async function GET() {
  const session = await getSafeServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getBasicUser(session.user.id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!hasExtendedProfileModels()) {
    return NextResponse.json(withDefaultExtendedPayload(user));
  }

  try {
    const payload = await getProfilePayload(session.user.id);
    return NextResponse.json({ user, ...payload });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json(withDefaultExtendedPayload(user));
    }

    return NextResponse.json({ error: "Could not load profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSafeServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateSchema.parse(body);

    const hasExtendedModels = hasExtendedProfileModels();

    if (!hasExtendedModels && (parsed.profile || parsed.steamProfile || parsed.friends || parsed.gameStats || parsed.badges || parsed.achievements)) {
      return NextResponse.json(
        { error: "Profile models are not available yet. Run Prisma generate/migrations and restart the dev server." },
        { status: 500 },
      );
    }

    const result = await updateProfilePayload(session.user.id, parsed);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    if (error instanceof ProfileInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (isMissingTableError(error)) {
      return NextResponse.json(
        { error: "Database schema is out of date. Run Prisma migration and try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Could not update profile" }, { status: 500 });
  }
}
