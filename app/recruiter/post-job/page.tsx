import { Badge } from "@/components/ui/Badge";
import { PostJobForm } from "@/components/recruiter/PostJobForm";
import { requireUser } from "@/lib/session";

export default async function PostJobPage() {
  await requireUser(["RECRUITER"]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge tone="teal">Recruiter</Badge>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Post a new opportunity.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink/60">
          Add clear role details so students can make quick swipe decisions.
        </p>
      </div>
      <PostJobForm />
    </section>
  );
}
