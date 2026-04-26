"use client";

import type { StudentProfile } from "@prisma/client";
import { Loader2, Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export function ProfileForm({ profile }: { profile: StudentProfile | null }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: form.get("phone"),
        skills: form.get("skills"),
        education: form.get("education"),
        resumeUrl: form.get("resumeUrl"),
        preferredLocation: form.get("preferredLocation"),
        preferredJobType: form.get("preferredJobType"),
        experienceLevel: form.get("experienceLevel")
      })
    });

    const data = await response.json();
    setLoading(false);
    setMessage(data.message ?? "Saved.");
  }

  const inputClass = "focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm";
  const textareaClass = "focus-ring mt-2 min-h-28 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm";

  return (
    <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" defaultValue={profile?.phone ?? ""} className={inputClass} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="resumeUrl">Resume link</label>
          <input id="resumeUrl" name="resumeUrl" defaultValue={profile?.resumeUrl ?? ""} placeholder="https://..." className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-ink/70" htmlFor="skills">Skills</label>
          <textarea id="skills" name="skills" defaultValue={profile?.skills ?? ""} placeholder="Java, Python, SQL, React" className={textareaClass} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="education">Education</label>
          <input id="education" name="education" defaultValue={profile?.education ?? ""} className={inputClass} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="preferredLocation">Preferred location</label>
          <input id="preferredLocation" name="preferredLocation" defaultValue={profile?.preferredLocation ?? ""} className={inputClass} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="preferredJobType">Preferred job type</label>
          <input id="preferredJobType" name="preferredJobType" defaultValue={profile?.preferredJobType ?? ""} className={inputClass} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="experienceLevel">Experience level</label>
          <input id="experienceLevel" name="experienceLevel" defaultValue={profile?.experienceLevel ?? "Fresher"} className={inputClass} required />
        </div>
      </div>
      {message ? <p className="mt-5 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">{message}</p> : null}
      <Button type="submit" disabled={loading} className="mt-6">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save profile
      </Button>
    </form>
  );
}
