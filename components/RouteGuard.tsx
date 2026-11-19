"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/types";
import { Button, LinkButton } from "./ui/Button";
import { FullPageSpinner } from "./ui/Feedback";

export function UnauthorizedNotice({ title = "You don't have access to this page", home }: { title?: string; home: string }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-3 max-w-md text-charcoal-600">This area is limited to a different type of account. If you think this is a mistake, sign in with the right account.</p>
      <LinkButton href={home} className="mt-7">
        Go to my dashboard
      </LinkButton>
    </div>
  );
}

/** Client-side authorization gate. The API enforces the same rules independently. */
export function RouteGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [isLoading, user, router, pathname]);

  if (isLoading || !user) return <FullPageSpinner />;

  if (user.isBlocked) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-3xl">Your account is blocked</h1>
        <p className="mt-3 max-w-md text-charcoal-600">You can no longer use bookings or payments. Contact the salon if you believe this is a mistake.</p>
        <Button className="mt-7" onClick={logout}>
          Log out
        </Button>
        <Link href="/" className="mt-4 text-sm text-charcoal-500 underline">
          Back to website
        </Link>
      </div>
    );
  }

  if (user.role !== role) return <UnauthorizedNotice home={user.role === "admin" ? "/admin" : "/dashboard"} />;
  return <>{children}</>;
}
