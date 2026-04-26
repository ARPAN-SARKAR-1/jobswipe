import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";
import { roleDashboard } from "@/lib/utils";
import { registerSchema } from "@/lib/validators";
import type { UserRole } from "@/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: result.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: result.data.email.toLowerCase() },
    select: { id: true }
  });

  if (existing) {
    return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(result.data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: result.data.name,
      email: result.data.email.toLowerCase(),
      passwordHash,
      role: result.data.role,
      studentProfile:
        result.data.role === "STUDENT"
          ? {
              create: {
                phone: "",
                skills: "",
                education: "",
                resumeUrl: "",
                preferredLocation: "",
                preferredJobType: "",
                experienceLevel: "Fresher"
              }
            }
          : undefined,
      companyProfile:
        result.data.role === "RECRUITER"
          ? {
              create: {
                companyName: `${result.data.name}'s Company`,
                website: "",
                description: "Company profile pending.",
                location: ""
              }
            }
          : undefined
    }
  });

  await setSession(user.id, user.role as UserRole);

  return NextResponse.json({
    message: "Account created.",
    redirectTo: roleDashboard(user.role)
  });
}
