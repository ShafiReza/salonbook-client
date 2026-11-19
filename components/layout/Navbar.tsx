"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button, LinkButton } from "../ui/Button";
import { Avatar } from "../ui/Media";
import { Logo } from "../ui/Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const dashboardHref = user?.role === "admin" ? "/admin" : "/dashboard";
  const linkClass = (href: string) =>
    cn("rounded-full px-4 py-2 text-sm font-medium transition-colors", (href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "bg-blush-50 text-blush-700" : "text-charcoal-700 hover:bg-sand-100");

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isLoading ? (
            <div className="skeleton h-9 w-40 rounded-full" />
          ) : user ? (
            <>
              <Link href={dashboardHref} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-sand-100">
                <Avatar src={user.image} name={user.name} />
                <span className="max-w-32 truncate text-sm font-medium text-charcoal-900">{user.name}</span>
              </Link>
              <LinkButton href={dashboardHref} variant="outline" size="sm">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </LinkButton>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <LinkButton href="/login" variant="ghost" size="sm">
                Sign In
              </LinkButton>
              <LinkButton href="/register" size="sm">
                Sign Up
              </LinkButton>
            </>
          )}
        </div>

        <button className="rounded-full p-2 text-charcoal-800 hover:bg-sand-100 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-sand-200 bg-sand-50 px-4 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {isLoading ? null : user ? (
              <>
                <div className="flex items-center gap-3 px-1 pb-1">
                  <Avatar src={user.image} name={user.name} className="h-10 w-10" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <LinkButton href={dashboardHref} variant="outline">
                  Dashboard
                </LinkButton>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkButton href="/login" variant="outline">
                  Sign In
                </LinkButton>
                <LinkButton href="/register">Sign Up</LinkButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
