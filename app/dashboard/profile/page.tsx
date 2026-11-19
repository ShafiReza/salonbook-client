"use client";

import { PageHeader } from "@/components/dashboard/DashboardShell";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default function CustomerProfilePage() {
  return (
    <>
      <PageHeader title="My profile" description="Update how you appear and how the salon can reach you." />
      <ProfileForm />
    </>
  );
}
