"use client";

import { CalendarDays, Globe, LayoutDashboard, User } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";
import { RouteGuard } from "@/components/RouteGuard";

const items: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/appointments", label: "My Appointments", icon: CalendarDays },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/", label: "Back to Website", icon: Globe, external: true },
];

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard role="customer">
      <DashboardShell items={items} root="/dashboard" badge="Customer dashboard">
        {children}
      </DashboardShell>
    </RouteGuard>
  );
}
