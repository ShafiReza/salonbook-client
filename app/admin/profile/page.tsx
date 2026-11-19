"use client";

import { PageHeader } from "@/components/dashboard/DashboardShell";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default function AdminProfilePage() {
  return (
    <>
      <PageHeader title="My profile" description="Update your admin account details." />
      <ProfileForm />
    </>
  );
}
