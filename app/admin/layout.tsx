"use client";

import { CalendarCheck, Globe, LayoutDashboard, PlusCircle, Receipt, Scissors, User, Users } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";
import { RouteGuard } from "@/components/RouteGuard";

const items: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/services", label: "Manage Services", icon: Scissors, exact: true },
  { href: "/admin/services/new", label: "Add Service", icon: PlusCircle },
  { href: "/admin/appointments", label: "Manage Appointments", icon: CalendarCheck },
  { href: "/admin/customers", label: "Manage Customers", icon: Users },
  { href: "/admin/transactions", label: "Transactions", icon: Receipt },
  { href: "/admin/profile", label: "My Profile", icon: User },
  { href: "/", label: "View Website", icon: Globe, external: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard role="admin">
      <DashboardShell items={items} root="/admin" badge="Admin panel">
        {children}
      </DashboardShell>
    </RouteGuard>
  );
}
