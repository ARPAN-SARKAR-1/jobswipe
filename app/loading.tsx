import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink shadow-card">
        <Loader2 className="h-4 w-4 animate-spin text-ocean" />
        Loading JobSwipe
      </div>
    </div>
  );
}
