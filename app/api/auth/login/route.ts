import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";
import { roleDashboard } from "@/lib/utils";
import { loginSchema } from "@/lib/validators";
import type { UserRole } from "@/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: result.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: result.data.email.toLowerCase() }
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(result.data.password, user.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  await setSession(user.id, user.role as UserRole);

  return NextResponse.json({
    message: "Login successful.",
    redirectTo: roleDashboard(user.role)
  });
}
