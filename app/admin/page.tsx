"use client";

import { Banknote, CalendarCheck, CalendarClock, CalendarDays, Scissors, Users } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { useAsync } from "@/hooks/useAsync";
import { formatPrice } from "@/lib/utils";
import { statsApi } from "@/services/endpoints";

export default function AdminOverviewPage() {
  const { data, loading, error, reload } = useAsync(() => statsApi.admin(), []);
  return (
    <>
      <PageHeader title="Admin overview" description="Live numbers from your salon's database." />
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        data && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Registered customers" value={data.customers} icon={Users} />
            <StatCard label="Active services" value={data.activeServices} icon={Scissors} />
            <StatCard label="Appointment requests" value={data.totalAppointments} icon={CalendarDays} />
            <StatCard label="Pending appointments" value={data.pending} icon={CalendarClock} hint="Need your review" />
            <StatCard label="Confirmed appointments" value={data.confirmed} icon={CalendarCheck} />
            <StatCard label="Successful payments" value={data.successfulPayments} icon={Banknote} hint={`${formatPrice(data.revenue)} collected`} />
          </div>
        )
      )}
    </>
  );
}
