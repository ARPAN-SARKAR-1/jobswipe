import { Mail, UserRound } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function ProfilePage() {
  const user = await requireUser(["STUDENT"]);
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <Badge tone="teal">Student profile</Badge>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Keep your preferences current.</h1>
          <p className="mt-3 text-base leading-7 text-ink/60">
            Profile information powers the final year project story around personalized job discovery.
          </p>
        </div>
        <div className="glass-panel rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
              <UserRound className="h-6 w-6" />
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
      <ProfileForm profile={profile} />
    </section>
  );
}
