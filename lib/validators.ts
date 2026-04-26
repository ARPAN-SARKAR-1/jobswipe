import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["STUDENT", "RECRUITER"])
});

export const profileSchema = z.object({
  phone: z.string().min(7, "Enter a valid phone number."),
  skills: z.string().min(2, "Add at least one skill."),
  education: z.string().min(2, "Education is required."),
  resumeUrl: z.string().url("Enter a valid resume URL.").or(z.literal("")),
  preferredLocation: z.string().min(2, "Preferred location is required."),
  preferredJobType: z.string().min(2, "Preferred job type is required."),
  experienceLevel: z.string().min(2, "Experience level is required.")
});

export const jobSchema = z.object({
  title: z.string().min(3, "Job title is required."),
  companyName: z.string().min(2, "Company name is required."),
  location: z.string().min(2, "Location is required."),
  jobType: z.string().min(2, "Select a job type."),
  salary: z.string().min(2, "Salary or stipend is required."),
  skills: z.string().min(2, "Add required skills."),
  description: z.string().min(20, "Description should be at least 20 characters."),
  eligibility: z.string().min(10, "Eligibility should be at least 10 characters."),
  deadline: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid deadline.")
});

export const swipeSchema = z.object({
  jobId: z.string().min(1),
  action: z.enum(["LIKE", "REJECT", "SAVE"])
});

export const statusSchema = z.object({
  status: z.enum(["APPLIED", "VIEWED", "SHORTLISTED", "REJECTED"])
});
