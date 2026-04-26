import { Badge } from "@/components/ui/Badge";

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Badge tone="teal">Terms</Badge>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-ink">Terms and Conditions</h1>
      <div className="glass-panel mt-8 rounded-3xl p-6 text-sm leading-7 text-ink/68">
        <p>
          JobSwipe is a final year project demo for job and internship discovery. Users should provide accurate profile, company, job, and application information.
        </p>
        <p className="mt-4">
          Job seekers are responsible for the links and resume PDFs they upload. Recruiters are responsible for publishing genuine opportunities and maintaining application statuses.
        </p>
        <p className="mt-4">
          Uploaded files are stored locally in development. For production, replace local storage with secure cloud storage and configure email delivery for password resets.
        </p>
      </div>
    </section>
  );
}
