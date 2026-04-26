import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { roleDashboard } from "@/lib/utils";
import type { SessionUser, UserRole } from "@/types";

const COOKIE_NAME = "jobswipe_session";
const SESSION_DAYS = 7;

type SessionPayload = {
  userId: string;
  role: UserRole;
  expiresAt: number;
};

function secret() {
  return process.env.AUTH_SECRET ?? "jobswipe-development-secret";
}

function encode(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode<T>(value: string): T | null {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function verify(token: string): SessionPayload | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  if (expected.length !== signature.length) return null;

  const valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!valid) return null;

  const session = decode<SessionPayload>(payload);
  if (!session || session.expiresAt < Date.now()) return null;
  return session;
}

export function makeSessionToken(userId: string, role: UserRole) {
  const payload = encode({
    userId,
    role,
    expiresAt: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  });

  return `${payload}.${sign(payload)}`;
}

export async function setSession(userId: string, role: UserRole) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, makeSessionToken(userId, role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function readSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verify(token);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await readSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  if (!user || !["STUDENT", "RECRUITER", "ADMIN"].includes(user.role)) return null;
  return user as SessionUser;
}

export async function requireUser(roles?: UserRole[]) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (roles?.length && !roles.includes(user.role)) {
    redirect(roleDashboard(user.role));
  }

  return user;
}

export function getCookieName() {
  return COOKIE_NAME;
}
