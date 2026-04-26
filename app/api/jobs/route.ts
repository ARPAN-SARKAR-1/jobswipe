import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { jobSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = jobSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: result.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      recruiterId: user.id,
      title: result.data.title,
      companyName: result.data.companyName,
      location: result.data.location,
      jobType: result.data.jobType,
      salary: result.data.salary,
      skills: result.data.skills,
      description: result.data.description,
      eligibility: result.data.eligibility,
      deadline: new Date(result.data.deadline)
    }
  });

  return NextResponse.json({ message: "Job posted successfully.", job });
}
