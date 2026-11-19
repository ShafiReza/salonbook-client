import Link from "next/link";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { AppointmentStatus, PaymentStatus, ServiceStatus } from "@/types";
import { Button } from "./Button";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} aria-hidden />;
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-blush-600", className)} aria-label="Loading" />;
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-charcoal-900/15 bg-white px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blush-50 text-blush-500">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="text-xl">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-charcoal-600">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry, backHref }: { message: string; onRetry?: () => void; backHref?: string }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-3xl border border-red-200 bg-red-50/60 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-xl">We couldn&apos;t load this</h3>
      <p className="mt-2 max-w-md text-sm text-charcoal-700">{message}</p>
      <div className="mt-6 flex gap-3">
        {onRetry && <Button onClick={onRetry}>Try again</Button>}
        {backHref && (
          <Link href={backHref} className="inline-flex h-11 items-center rounded-full border border-charcoal-900/20 bg-white px-5 text-sm font-medium">
            Go back
          </Link>
        )}
      </div>
    </div>
  );
}

const badgeStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
  paid: "bg-emerald-100 text-emerald-800",
  unpaid: "bg-sand-200 text-charcoal-700",
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-sand-200 text-charcoal-600",
  blocked: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
};

export function Badge({ children, tone }: { children: ReactNode; tone: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize", badgeStyles[tone] ?? "bg-sand-200 text-charcoal-700")}>{children}</span>;
}

export const StatusBadge = ({ status }: { status: AppointmentStatus | PaymentStatus | ServiceStatus | "blocked" | "failed" }) => (
  <Badge tone={status}>{status}</Badge>
);
