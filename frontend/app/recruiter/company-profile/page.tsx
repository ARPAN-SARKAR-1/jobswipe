"use client";

import { Building2, Loader2, Save, Upload } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { absoluteUrl, apiFetch, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { useProtected } from "@/hooks/useProtected";
import type { CompanyProfile } from "@/types";

export default function CompanyProfilePage() {
  const { loading } = useProtected(["RECRUITER"]);
  const { showToast } = useToast();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setCompany(await apiFetch<CompanyProfile>("/recruiter/company-profile"));
  }

  useEffect(() => {
    load().catch(() => showToast("Could not load company profile.", "error"));
  }, [showToast]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      const updated = await apiFetch<CompanyProfile>("/recruiter/company-profile", {
        method: "PUT",
        body: JSON.stringify({
          companyName: form.get("companyName"),
          website: form.get("website"),
          description: form.get("description"),
          location: form.get("location")
        })
      });
      setCompany(updated);
      showToast("Company profile updated.", "success");
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Update failed.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function upload(file?: File) {
    if (!file) return;
    const body = new FormData();
    body.set("file", file);
    setSaving(true);
    try {
      await apiFetch<{ url: string }>("/recruiter/company-logo", { method: "POST", body });
      await load();
      showToast("Company logo uploaded.", "success");
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Logo upload failed.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;

  const inputClass = "focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm";

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Badge tone="teal">Company profile</Badge>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Recruiter company details.</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-ink text-white">
            {company?.companyLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={absoluteUrl(company.companyLogoUrl)} alt="" className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-9 w-9" />
            )}
          </div>
          <label className="mt-5 block rounded-2xl bg-white p-4 text-sm font-semibold text-ink/66">
            Company logo
            <input type="file" accept="image/png,image/jpeg,image/webp" className="mt-3 block w-full text-sm" onChange={(event) => upload(event.target.files?.[0])} />
            <Button type="button" variant="secondary" disabled={saving} className="mt-3">
              <Upload className="h-4 w-4" />
              Upload logo
            </Button>
          </label>
        </div>
        <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Company name" name="companyName" defaultValue={company?.companyName ?? ""} className={inputClass} required />
            <Field label="Website" name="website" defaultValue={company?.website ?? ""} className={inputClass} />
            <Field label="Location" name="location" defaultValue={company?.location ?? ""} className={inputClass} />
            <label className="text-sm font-semibold text-ink/70 md:col-span-2">
              Description
              <textarea name="description" defaultValue={company?.description ?? ""} className="focus-ring mt-2 min-h-32 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm" />
            </label>
          </div>
          <Button type="submit" disabled={saving} className="mt-6">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save company
          </Button>
        </form>
      </div>
    </section>
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
