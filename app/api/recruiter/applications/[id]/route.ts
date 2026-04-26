import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { statusSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = statusSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: result.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const application = await prisma.application.findFirst({
    where: {
      id,
      job: { recruiterId: user.id }
    },
    select: { id: true }
  });

  if (!application) {
    return NextResponse.json({ message: "Application not found." }, { status: 404 });
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status: result.data.status }
  });

  return NextResponse.json({ message: "Status updated.", application: updated });
}
