import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white shadow-card hover:-translate-y-0.5 hover:bg-black",
  secondary: "bg-white text-ink border border-mist hover:-translate-y-0.5 hover:border-ink/20",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  danger: "bg-white text-rose-700 border border-rose-100 hover:-translate-y-0.5 hover:bg-rose-50",
  success: "bg-ocean text-white shadow-card hover:-translate-y-0.5 hover:bg-teal-800"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "h-12 w-12 p-0"
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
