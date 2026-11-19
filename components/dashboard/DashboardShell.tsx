"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Avatar } from "../ui/Media";
import { Logo } from "../ui/Logo";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  external?: boolean;
}

export function DashboardShell({ items, root, badge, children }: { items: NavItem[]; root: string; badge: string; children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (item: NavItem) => (item.exact || item.href === root ? pathname === item.href : pathname.startsWith(item.href));

  const sidebar = (
    <div className="flex h-full flex-col bg-charcoal-950 text-charcoal-400">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo light />
        <button className="rounded-full p-2 text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="px-5 pb-2 pt-4 text-xs text-charcoal-500">{badge}</p>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label={badge}>
        {items.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", isActive(item) && !item.external ? "bg-blush-600 text-white" : "hover:bg-charcoal-800 hover:text-white")}
          >
            <item.icon className="h-4 w-4" /> {item.label}
          </Link>
        ))}
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-charcoal-800 hover:text-white">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </nav>
      {user && (
        <div className="flex items-center gap-3 border-t border-charcoal-800 p-4">
          <Avatar src={user.image} name={user.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal-950/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-sand-200 bg-sand-50/90 px-4 backdrop-blur lg:hidden">
          <button className="rounded-full p-2 hover:bg-sand-100" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-lg font-semibold">SalonBook</span>
        </div>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-charcoal-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, hint }: { label: string; value: string | number; icon: LucideIcon; hint?: string }) {
  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-600">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-50 text-blush-600">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-4xl text-charcoal-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-charcoal-500">{hint}</p>}
    </div>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white">{children}</div>;
}
