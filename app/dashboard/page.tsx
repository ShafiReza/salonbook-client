"use client";

import { CalendarCheck, CalendarClock, CalendarX, CalendarDays } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { LinkButton } from "@/components/ui/Button";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { useAuth } from "@/contexts/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { statsApi } from "@/services/endpoints";

export default function CustomerOverviewPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(() => statsApi.customer(), []);

  return (
    <>
      <PageHeader title={`Hello, ${user?.name?.split(" ")[0] ?? "there"}`} description="Here's where your appointments stand." action={<LinkButton href="/services">Book a service</LinkButton>} />
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        data && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total requests" value={data.total} icon={CalendarDays} />
            <StatCard label="Pending" value={data.pending} icon={CalendarClock} hint="Waiting for salon confirmation" />
            <StatCard label="Confirmed" value={data.confirmed} icon={CalendarCheck} hint="Ready for payment" />
            <StatCard label="Cancelled" value={data.cancelled} icon={CalendarX} />
          </div>
        )
      )}
    </>
  );
}
