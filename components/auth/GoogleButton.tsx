"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/Button";

export function GoogleButton({ next, label = "Continue with Google" }: { next?: string | null; label?: string }) {
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      const suffix = next ? `?next=${encodeURIComponent(next)}` : "";
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/redirect${suffix}`,
        errorCallbackURL: `${window.location.origin}/login`,
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      toast.error(e instanceof Error && e.message ? e.message : "Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="lg" className="w-full" onClick={go} loading={loading}>
      {!loading && (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.9a5.04 5.04 0 0 1-2.19 3.31v2.75h3.55c2.08-1.92 3.24-4.74 3.24-8.3Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.75c-.98.66-2.24 1.06-3.73 1.06-2.87 0-5.3-1.94-6.17-4.55H2.16v2.84A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.83 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.16a11 11 0 0 0 0 9.88l3.67-2.84Z" />
          <path fill="#EA4335" d="M12 5.35c1.62 0 3.06.56 4.21 1.65l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.16 7.06l3.67 2.84C6.7 7.29 9.13 5.35 12 5.35Z" />
        </svg>
      )}
      {label}
    </Button>
  );
}
