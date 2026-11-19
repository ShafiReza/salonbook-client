import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border bg-white px-4 text-sm text-charcoal-900 placeholder:text-charcoal-400 transition-colors focus:border-blush-500 focus:outline-none focus:ring-2 focus:ring-blush-200 disabled:bg-sand-100 disabled:text-charcoal-500";

export function Field({ label, error, hint, children, htmlFor }: { label?: string; error?: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-charcoal-800">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-charcoal-500">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return <input ref={ref} className={cn(fieldBase, "h-11", invalid ? "border-red-400" : "border-charcoal-900/15", className)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(function Textarea(
  { className, invalid, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(fieldBase, "min-h-28 py-3", invalid ? "border-red-400" : "border-charcoal-900/15", className)} {...props} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(function Select(
  { className, invalid, children, ...props },
  ref,
) {
  return (
    <select ref={ref} className={cn(fieldBase, "h-11", invalid ? "border-red-400" : "border-charcoal-900/15", className)} {...props}>
      {children}
    </select>
  );
});
