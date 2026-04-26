import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { profileSchema } from "@/lib/validators";

export async function PUT(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = profileSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: result.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const profile = await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: result.data,
    create: {
      userId: user.id,
      ...result.data
    }
  });

  return NextResponse.json({ message: "Profile updated.", profile });
}
