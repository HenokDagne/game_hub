import { NextResponse } from "next/server";
import { getSafeServerSession } from "@/lib/session";
import { ProfileImageValidationError, saveProfileImage } from "@/lib/profile-image-upload";

export async function POST(request: Request) {
  const session = await getSafeServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const profileImage = formData.get("profileImage");

    if (!(profileImage instanceof File)) {
      return NextResponse.json({ error: "Profile image file is required" }, { status: 400 });
    }

    const uploadedPath = await saveProfileImage(profileImage);

    return NextResponse.json({ profileImage: uploadedPath });
  } catch (error) {
    if (error instanceof ProfileImageValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Could not upload profile image" }, { status: 500 });
  }
}
