import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { swipeSchema } from "@/lib/validators";

const messages = {
  LIKE: "Application sent. Nice match.",
  REJECT: "Skipped. Finding a better fit.",
  SAVE: "Saved for later."
};

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = swipeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: result.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const job = await prisma.job.findFirst({
    where: { id: result.data.jobId, isActive: true },
    select: { id: true }
  });

  if (!job) {
    return NextResponse.json({ message: "This job is no longer available." }, { status: 404 });
  }

  await prisma.swipe.upsert({
    where: {
      userId_jobId: {
        userId: user.id,
        jobId: result.data.jobId
      }
    },
    update: { action: result.data.action },
    create: {
      userId: user.id,
      jobId: result.data.jobId,
      action: result.data.action
    }
  });

  if (result.data.action === "LIKE") {
    await prisma.application.upsert({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId: result.data.jobId
        }
      },
      update: {},
      create: {
        userId: user.id,
        jobId: result.data.jobId,
        status: "APPLIED"
      }
    });
  }

  return NextResponse.json({ message: messages[result.data.action] });
}
