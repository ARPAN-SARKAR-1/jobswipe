import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const isActive = Boolean(body?.isActive);

  const job = await prisma.job.update({
    where: { id },
    data: { isActive }
  });

  return NextResponse.json({ message: isActive ? "Job activated." : "Job paused.", job });
}
