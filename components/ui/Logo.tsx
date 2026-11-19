import Link from "next/link";
import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)} aria-label="SalonBook home">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-600 text-white">
        <Scissors className="h-4 w-4" />
      </span>
      <span className={cn("font-display text-2xl font-semibold tracking-tight", light ? "text-white" : "text-charcoal-900")}>SalonBook</span>
    </Link>
  );
}
