import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-black tracking-tight text-ink">Page not found</h1>
      <p className="mt-4 text-base leading-7 text-ink/60">The page you opened is not part of the JobSwipe demo flow.</p>
      <Link href="/">
        <Button className="mt-6">Go home</Button>
      </Link>
    </section>
  );
}
