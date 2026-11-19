"use client";

import { PageHeader } from "@/components/dashboard/DashboardShell";
import { ServiceForm } from "@/components/dashboard/ServiceForm";

export default function AddServicePage() {
  return (
    <>
      <PageHeader title="Add service" description="New services are active by default and appear on the website straight away." />
      <ServiceForm />
    </>
  );
}
