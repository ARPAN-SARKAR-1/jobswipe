import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST() {
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const lastSwipe = await prisma.swipe.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          title: true
        }
      }
    }
  });

  if (!lastSwipe) {
    return NextResponse.json({ message: "Nothing to undo." }, { status: 404 });
  }

  await prisma.swipe.delete({
    where: { id: lastSwipe.id }
  });

  if (lastSwipe.action === "LIKE") {
    await prisma.application.deleteMany({
      where: {
        userId: user.id,
        jobId: lastSwipe.jobId
      }
    });
  }

  return NextResponse.json({
    message: `Restored ${lastSwipe.job.title}.`
  });
}
