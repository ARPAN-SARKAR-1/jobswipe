"use client";

import { Loader2, Save, Upload } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { absoluteUrl, apiFetch, ApiError } from "@/lib/api";
import { experienceOptions, jobTypeOptions } from "@/lib/labels";
import { useToast } from "@/lib/toast";
import type { JobSeekerProfile } from "@/types";

export function ProfileForm({ profile, onSaved }: { profile: JobSeekerProfile | null; onSaved: (profile: JobSeekerProfile) => void }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const updated = await apiFetch<JobSeekerProfile>("/jobseeker/profile", {
        method: "PUT",
        body: JSON.stringify({
          phone: form.get("phone"),
          githubUrl: form.get("githubUrl"),
          education: form.get("education"),
          degree: form.get("degree"),
          college: form.get("college"),
          passingYear: form.get("passingYear") ? Number(form.get("passingYear")) : null,
          cgpaOrPercentage: form.get("cgpaOrPercentage"),
          skills: form.get("skills"),
          experienceLevel: form.get("experienceLevel"),
          preferredLocation: form.get("preferredLocation"),
          preferredJobType: form.get("preferredJobType")
        })
      });
      onSaved(updated);
      showToast("Profile updated.", "success");
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Profile update failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function upload(path: string, file: File | undefined, key: string) {
    if (!file) return;
    if (key === "resume" && file.type !== "application/pdf") {
      showToast("Only PDF resumes are allowed.", "error");
      return;
    }
    if (key === "resume" && file.size > 5 * 1024 * 1024) {
      showToast("Resume PDF must be 5MB or smaller.", "error");
      return;
    }
    const body = new FormData();
    body.set("file", file);
    setUploading(key);
    try {
      await apiFetch<{ url: string }>(path, { method: "POST", body });
      showToast(key === "resume" ? "Resume uploaded." : "Profile picture uploaded.", "success");
      const updated = await apiFetch<JobSeekerProfile>("/jobseeker/profile");
      onSaved(updated);
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Upload failed.", "error");
    } finally {
      setUploading("");
    }
  }

  const inputClass = "focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm";
  const textareaClass = "focus-ring mt-2 min-h-24 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm";

  return (
    <div className="grid gap-6">
      <div className="glass-panel rounded-3xl p-6">
        <h2 className="text-xl font-black text-ink">Uploads</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="rounded-2xl bg-white p-4 text-sm font-semibold text-ink/66">
            Profile picture
            <input type="file" accept="image/png,image/jpeg,image/webp" className="mt-3 block w-full text-sm" onChange={(event) => upload("/jobseeker/profile-picture", event.target.files?.[0], "picture")} />
            <Button type="button" variant="secondary" disabled={uploading === "picture"} className="mt-3">
              {uploading === "picture" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload image
            </Button>
          </label>
          <label className="rounded-2xl bg-white p-4 text-sm font-semibold text-ink/66">
            Resume PDF
            <input type="file" accept="application/pdf" className="mt-3 block w-full text-sm" onChange={(event) => upload("/jobseeker/resume", event.target.files?.[0], "resume")} />
            {profile?.resumePdfUrl ? (
              <a href={absoluteUrl(profile.resumePdfUrl)} target="_blank" className="mt-3 block font-bold text-ocean" rel="noreferrer">
                View uploaded resume
              </a>
            ) : null}
          </label>
        </div>
      </div>

      <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Phone" name="phone" defaultValue={profile?.phone ?? ""} className={inputClass} />
          <Field label="GitHub Profile Link" name="githubUrl" defaultValue={profile?.githubUrl ?? ""} className={inputClass} placeholder="https://github.com/username" />
          <Field label="Degree" name="degree" defaultValue={profile?.degree ?? ""} className={inputClass} />
          <Field label="College / university" name="college" defaultValue={profile?.college ?? ""} className={inputClass} />
          <Field label="Passing year" name="passingYear" type="number" defaultValue={profile?.passingYear?.toString() ?? ""} className={inputClass} />
          <Field label="Percentage / CGPA" name="cgpaOrPercentage" defaultValue={profile?.cgpaOrPercentage ?? ""} className={inputClass} />
          <label className="text-sm font-semibold text-ink/70">
            Experience level
            <select name="experienceLevel" defaultValue={profile?.experienceLevel ?? "FRESHER"} className={inputClass}>
              {experienceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-ink/70">
            Preferred job type
            <select name="preferredJobType" defaultValue={profile?.preferredJobType ?? "INTERNSHIP"} className={inputClass}>
              {jobTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <Field label="Preferred location" name="preferredLocation" defaultValue={profile?.preferredLocation ?? ""} className={inputClass} />
          <label className="text-sm font-semibold text-ink/70 md:col-span-2">
            Skills
            <textarea name="skills" defaultValue={profile?.skills ?? ""} placeholder="Java, Python, SQL, React" className={textareaClass} />
          </label>
          <label className="text-sm font-semibold text-ink/70 md:col-span-2">
            Education details
            <textarea name="education" defaultValue={profile?.education ?? ""} className={textareaClass} />
          </label>
        </div>
        <Button type="submit" disabled={loading} className="mt-6">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save profile
        </Button>
      </form>
    </div>
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
