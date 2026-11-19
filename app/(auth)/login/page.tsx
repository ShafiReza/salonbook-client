"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zodResolver";
import { toast } from "sonner";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Form";
import { useAuth } from "@/contexts/AuthContext";
import { authClient } from "@/lib/auth-client";
import { destinationFor, safeNext } from "@/lib/redirect";
import { loginSchema, type LoginValues } from "@/utils/validation";

function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("redirect"));
  const { user, isLoading } = useAuth();
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (!isLoading && user) router.replace(destinationFor(user.role, next));
  }, [isLoading, user, next, router]);

  async function onSubmit(values: LoginValues) {
    const { data, error } = await authClient.signIn.email({ email: values.email, password: values.password });
    if (error || !data) {
      toast.error(error?.message || "Incorrect email or password");
      return;
    }
    toast.success("Welcome back!");
    const role = (data.user as { role?: string } | undefined)?.role;
    router.replace(role ? destinationFor(role, next) : `/auth/redirect${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  }

  return (
    <div>
      <h1 className="text-4xl">Welcome back</h1>
      <p className="mt-2 text-charcoal-600">Sign in to manage your appointments.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" className="pr-11" invalid={!!errors.password} {...register("password")} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500" aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs text-charcoal-500">
        <span className="h-px flex-1 bg-sand-300" /> or <span className="h-px flex-1 bg-sand-300" />
      </div>
      <GoogleButton next={next} />

      <p className="mt-8 text-center text-sm text-charcoal-600">
        New to SalonBook?{" "}
        <Link href={next ? `/register?redirect=${encodeURIComponent(next)}` : "/register"} className="font-medium text-blush-700 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
