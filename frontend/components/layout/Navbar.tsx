"use client";

import { BriefcaseBusiness, LayoutDashboard, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { dashboardFor, useAuth } from "@/lib/auth";
import { absoluteUrl } from "@/lib/api";
import { roleLabels } from "@/lib/labels";
import { LogoutButton } from "@/components/layout/LogoutButton";

export function Navbar() {
  const { user } = useAuth();

  const jobSeekerLinks = [
    { href: "/dashboard/jobseeker", label: "Dashboard" },
    { href: "/swipe", label: "Swipe" },
    { href: "/jobs", label: "Jobs" },
    { href: "/applications", label: "Applications" },
    { href: "/profile", label: "Profile" }
  ];

  const recruiterLinks = [
    { href: "/dashboard/recruiter", label: "Dashboard" },
    { href: "/recruiter/company-profile", label: "Company" },
    { href: "/recruiter/post-job", label: "Post Job" }
  ];

  const links = user?.role === "JOB_SEEKER" ? jobSeekerLinks : user?.role === "RECRUITER" ? recruiterLinks : [];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-white backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-full">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-ink">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg font-black tracking-tight">JobSwipe</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {user ? (
            <>
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white">
                  {link.label}
                </Link>
              ))}
              {user.role === "ADMIN" ? (
                <Link href="/dashboard/admin" className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white">
                  Admin
                </Link>
              ) : null}
            </>
          ) : (
            <>
              <Link href="/#features" className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-white/72 transition hover:text-white">
                Features
              </Link>
              <Link href="/terms" className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-white/72 transition hover:text-white">
                Terms
              </Link>
            </>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Link href={dashboardFor(user.role)} className="focus-ring hidden h-10 items-center gap-2 rounded-full border border-white/10 px-3 text-sm font-semibold text-white/78 transition hover:bg-white/10 sm:inline-flex">
                {user.profilePictureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={absoluteUrl(user.profilePictureUrl)} alt="" className="h-6 w-6 rounded-full object-cover" />
                ) : user.role === "ADMIN" ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : user.role === "RECRUITER" ? (
                  <BriefcaseBusiness className="h-4 w-4" />
                ) : (
                  <UserRound className="h-4 w-4" />
                )}
                {user.name.split(" ")[0]} · {roleLabels[user.role]}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="focus-ring inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold text-white/80 transition hover:bg-white/10">
                Login
              </Link>
              <Link href="/register" className="focus-ring inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-ink transition hover:bg-white/90">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
      {user && links.length ? (
        <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-2 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="focus-ring shrink-0 rounded-full bg-white/8 px-3 py-2 text-xs font-semibold text-white/76">
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
