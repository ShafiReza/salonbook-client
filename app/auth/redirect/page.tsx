"use client";


import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { FullPageSpinner } from "@/components/ui/Feedback";
import { useAuth } from "@/contexts/AuthContext";
import { destinationFor, safeNext } from "@/lib/redirect";

function Redirector() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? destinationFor(user.role, next) : "/login");
  }, [isLoading, user, next, router]);

  return <FullPageSpinner />;
}

export default function AuthRedirectPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Redirector />
    </Suspense>
  );
}
