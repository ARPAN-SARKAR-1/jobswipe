"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { PostJobForm } from "@/components/recruiter/PostJobForm";
import { apiFetch } from "@/lib/api";
import { useProtected } from "@/hooks/useProtected";
import type { CompanyProfile } from "@/types";

export default function PostJobPage() {
  const { loading } = useProtected(["RECRUITER"]);
  const [company, setCompany] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    apiFetch<CompanyProfile>("/recruiter/company-profile").then(setCompany).catch(() => undefined);
  }, []);

  if (loading) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge tone="teal">Recruiter</Badge>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Post a new opportunity.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink/60">Add clear role details, deadline, job type, and experience requirement so job seekers can swipe confidently.</p>
      </div>
      <PostJobForm company={company} />
    </section>
  );
}
