"use client";

import { Mail, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Badge } from "@/components/ui/Badge";
import { absoluteUrl, apiFetch } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { useProtected } from "@/hooks/useProtected";
import type { JobSeekerProfile } from "@/types";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useProtected(["JOB_SEEKER"]);
  const { showToast } = useToast();
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);

  useEffect(() => {
    if (!user) return;
    apiFetch<JobSeekerProfile>("/jobseeker/profile")
      .then(setProfile)
      .catch(() => showToast("Could not load profile.", "error"));
  }, [showToast, user]);

  if (loading || !user) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <Badge tone="teal">Job seeker profile</Badge>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Keep your preferences current.</h1>
          <p className="mt-3 text-base leading-7 text-ink/60">Add GitHub, resume PDF, education, experience, and profile picture for a complete application-ready profile.</p>
        </div>
        <div className="glass-panel rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-ink text-white">
              {user.profilePictureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={absoluteUrl(user.profilePictureUrl)} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-6 w-6" />
              )}
            </span>
            <div>
              <h2 className="text-xl font-black text-ink">{user.name}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink/56">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ProfileForm profile={profile} onSaved={(next) => { setProfile(next); refreshUser(); }} />
    </section>
  );
}
