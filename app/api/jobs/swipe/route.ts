import { NextResponse } from "next/server";
import { getSwipeJobs } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(await getSwipeJobs(user.id));
}
