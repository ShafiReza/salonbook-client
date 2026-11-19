"use client";


import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Feedback";
import { useAuth } from "@/contexts/AuthContext";
import { paymentsApi } from "@/services/endpoints";

type Phase = "checking" | "paid" | "delayed" | "error";

function Result() {
  const sessionId = useSearchParams().get("session_id");
  const { user, isLoading } = useAuth();
  const [phase, setPhase] = useState<Phase>("checking");

  // The page never marks anything as paid itself: it asks the server, which verifies the session with Stripe using the secret key.
  useEffect(() => {
    if (isLoading || !user || !sessionId) return;
    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      try {
        const r = await paymentsApi.sessionStatus(sessionId);
        if (cancelled) return;
        if (r.status === "paid") return setPhase("paid");
      } catch {
        if (!cancelled && attempts >= 2) return setPhase("error");
      }
      attempts += 1;
      if (attempts >= 12) return setPhase("delayed");
      setTimeout(poll, 2000);
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [isLoading, user, sessionId]);

  const content: Record<Phase | "invalid", { icon: React.ReactNode; title: string; text: string }> = {
    invalid: { icon: <XCircle className="h-9 w-9 text-red-600" />, title: "Missing payment reference", text: "We couldn't find a checkout session in this link. Check My Appointments for your payment status." },
    checking: { icon: <Spinner className="h-9 w-9" />, title: "Confirming your payment…", text: "We are verifying your payment with Stripe. This usually takes a few seconds." },
    paid: { icon: <CheckCircle2 className="h-9 w-9 text-emerald-600" />, title: "Payment received", text: "Thank you! Your appointment is paid and confirmed. See you soon." },
    delayed: { icon: <Clock3 className="h-9 w-9 text-amber-600" />, title: "Payment is still being confirmed", text: "Your payment went through on Stripe but our confirmation is taking longer than usual. Check My Appointments in a minute. You won't be charged twice." },
    error: { icon: <XCircle className="h-9 w-9 text-red-600" />, title: "We couldn't verify the payment", text: "Please check My Appointments for the latest payment status or sign in again." },
  };
  const c = content[!sessionId ? "invalid" : phase];

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">{c.icon}</div>
      <h1 className="text-3xl">{c.title}</h1>
      <p className="mt-3 text-charcoal-600">{c.text}</p>
      <div className="mt-8 flex gap-3">
        <LinkButton href="/dashboard/appointments">My appointments</LinkButton>
        <Link href="/" className="inline-flex h-11 items-center rounded-full border border-charcoal-900/20 bg-white px-5 text-sm font-medium">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <Result />
    </Suspense>
  );
}
