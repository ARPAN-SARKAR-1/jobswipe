"use client";

import { Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api";
import { experienceOptions, jobTypeOptions, workModeOptions } from "@/lib/labels";
import { useToast } from "@/lib/toast";
import type { CompanyProfile } from "@/types";

export function PostJobForm({ company }: { company?: CompanyProfile | null }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await apiFetch("/jobs", {
        method: "POST",
        body: JSON.stringify({
          title: form.get("title"),
          companyName: form.get("companyName"),
          companyLogoUrl: company?.companyLogoUrl,
          location: form.get("location"),
          jobType: form.get("jobType"),
          workMode: form.get("workMode"),
          salary: form.get("salary"),
          requiredSkills: form.get("requiredSkills"),
          requiredExperienceLevel: form.get("requiredExperienceLevel"),
          description: form.get("description"),
          eligibility: form.get("eligibility"),
          deadline: form.get("deadline"),
          active: true
        })
      });
      showToast("Job posted successfully.", "success");
      event.currentTarget.reset();
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Could not post job.", "error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm";
  const textareaClass = "focus-ring mt-2 min-h-28 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm";

  return (
    <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Job title" name="title" className={inputClass} required />
        <Field label="Company name" name="companyName" defaultValue={company?.companyName ?? ""} className={inputClass} required />
        <Field label="Location" name="location" className={inputClass} required />
        <label className="text-sm font-semibold text-ink/70">
          Job type
          <select name="jobType" className={inputClass} defaultValue="INTERNSHIP">
            {jobTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-ink/70">
          Work mode
          <select name="workMode" className={inputClass} defaultValue="HYBRID">
            {workModeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-ink/70">
          Experience requirement
          <select name="requiredExperienceLevel" className={inputClass} defaultValue="FRESHER">
            {experienceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <Field label="Salary / stipend" name="salary" className={inputClass} placeholder="Rs. 6 LPA or Rs. 25,000/month" required />
        <Field label="Deadline" name="deadline" type="date" className={inputClass} required />
        <Field label="Required skills" name="requiredSkills" className={inputClass + " md:col-span-2"} placeholder="Java, SQL, Spring Boot" required />
        <label className="text-sm font-semibold text-ink/70 md:col-span-2">
          Description
          <textarea name="description" className={textareaClass} required />
        </label>
        <label className="text-sm font-semibold text-ink/70 md:col-span-2">
          Eligibility
          <textarea name="eligibility" className={textareaClass} required />
        </label>
      </div>
      <Button type="submit" disabled={loading} className="mt-6">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Post job
      </Button>
    </form>
  );
}

function Field({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="text-sm font-semibold text-ink/70">
      {label}
      <input {...props} className={className} />
    </label>
  );
}
