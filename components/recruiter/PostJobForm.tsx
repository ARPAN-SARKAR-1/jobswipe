"use client";

import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export function PostJobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        companyName: form.get("companyName"),
        location: form.get("location"),
        jobType: form.get("jobType"),
        salary: form.get("salary"),
        skills: form.get("skills"),
        description: form.get("description"),
        eligibility: form.get("eligibility"),
        deadline: form.get("deadline")
      })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message ?? "Could not post job.");
      return;
    }

    setMessage(data.message);
    event.currentTarget.reset();
    router.refresh();
  }

  const inputClass = "focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm";
  const textareaClass = "focus-ring mt-2 min-h-28 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm";

  return (
    <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="title">Job title</label>
          <input id="title" name="title" className={inputClass} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="companyName">Company name</label>
          <input id="companyName" name="companyName" className={inputClass} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="location">Location</label>
          <input id="location" name="location" className={inputClass} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="jobType">Job type</label>
          <select id="jobType" name="jobType" className={inputClass} required defaultValue="Internship">
            <option>Internship</option>
            <option>Full-time</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="salary">Salary / stipend</label>
          <input id="salary" name="salary" className={inputClass} placeholder="Rs. 6 LPA or Rs. 25,000/month" required />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="deadline">Deadline</label>
          <input id="deadline" name="deadline" type="date" className={inputClass} required />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-ink/70" htmlFor="skills">Required skills</label>
          <input id="skills" name="skills" className={inputClass} placeholder="Java, SQL, Spring Boot" required />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-ink/70" htmlFor="description">Description</label>
          <textarea id="description" name="description" className={textareaClass} required />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-ink/70" htmlFor="eligibility">Eligibility</label>
          <textarea id="eligibility" name="eligibility" className={textareaClass} required />
        </div>
      </div>
      {message ? <p className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink/70 shadow-card">{message}</p> : null}
      <Button type="submit" disabled={loading} className="mt-6">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Post job
      </Button>
    </form>
  );
}
