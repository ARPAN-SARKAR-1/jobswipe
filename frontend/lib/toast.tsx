"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { X } from "lucide-react";

type Toast = {
  id: number;
  title: string;
  tone: "success" | "error" | "info";
};

type ToastContextValue = {
  showToast: (title: string, tone?: Toast["tone"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(title: string, tone: Toast["tone"] = "info") {
    const id = Date.now();
    setToasts((current) => [...current, { id, title, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3500);
  }

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-50 grid w-[min(92vw,24rem)] gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={
              "glass-panel flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-bold " +
              (toast.tone === "error" ? "text-rose-700" : toast.tone === "success" ? "text-teal-800" : "text-ink")
            }
          >
            <span>{toast.title}</span>
            <button type="button" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}>
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider.");
  return value;
}
