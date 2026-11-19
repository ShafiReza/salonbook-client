"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { ServiceForm } from "@/components/dashboard/ServiceForm";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { useAsync } from "@/hooks/useAsync";
import { servicesApi } from "@/services/endpoints";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, reload } = useAsync(() => servicesApi.get(id), [id]);
  return (
    <>
      <PageHeader title="Edit service" />
      {error ? <ErrorState message={error} onRetry={reload} backHref="/admin/services" /> : loading || !data ? <Skeleton className="h-96 max-w-3xl rounded-3xl" /> : <ServiceForm service={data} />}
    </>
  );
}
