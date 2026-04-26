import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const jobId = typeof body?.jobId === "string" ? body.jobId : "";

  if (!jobId) {
    return NextResponse.json({ message: "Job id is required." }, { status: 400 });
  }

  const job = await prisma.job.findFirst({
    where: { id: jobId, isActive: true },
    select: { id: true }
  });

  if (!job) {
    return NextResponse.json({ message: "This job is no longer available." }, { status: 404 });
  }

  const application = await prisma.application.upsert({
    where: {
      userId_jobId: {
        userId: user.id,
        jobId
      }
    },
    update: {},
    create: {
      userId: user.id,
      jobId,
      status: "APPLIED"
    }
  });

  await prisma.swipe.upsert({
    where: {
      userId_jobId: {
        userId: user.id,
        jobId
      }
    },
    update: { action: "LIKE" },
    create: {
      userId: user.id,
      jobId,
      action: "LIKE"
    }
  });

  return NextResponse.json({ message: "Application submitted.", application });
}
