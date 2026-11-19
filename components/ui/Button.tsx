import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-blush-600 text-white hover:bg-blush-700 shadow-sm shadow-blush-600/20",
  secondary: "bg-charcoal-900 text-white hover:bg-charcoal-700",
  outline:
    "border border-charcoal-900/20 bg-white text-charcoal-900 hover:border-charcoal-900/50 hover:bg-sand-100",
  ghost: "text-charcoal-700 hover:bg-sand-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant,
  size,
  loading,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClasses(variant, size, className)}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : null}
      {/* Label lives in its own element so the spinner is always inserted before a stable node
          (bare text nodes can be replaced by browser translation / extensions, breaking insertBefore). */}
      <span className="flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
}

export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={buttonClasses(variant, size, className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
