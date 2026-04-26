import { NextResponse } from "next/server";
import { getSavedJobs } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(await getSavedJobs(user.id));
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const jobId = typeof body?.jobId === "string" ? body.jobId : "";

  if (!jobId) {
    return NextResponse.json({ message: "Job id is required." }, { status: 400 });
  }

  await prisma.swipe.deleteMany({
    where: {
      userId: user.id,
      jobId,
      action: "SAVE"
    }
  });

  return NextResponse.json({ message: "Removed from saved jobs." });
}
