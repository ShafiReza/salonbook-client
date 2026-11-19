"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zodResolver";
import { toast } from "sonner";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { ImageInput, type ImageValue } from "@/components/auth/ImageInput";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Form";
import { useAuth } from "@/contexts/AuthContext";
import { authClient } from "@/lib/auth-client";
import { destinationFor, safeNext } from "@/lib/redirect";
import { uploadImage } from "@/services/endpoints";
import { registerSchema, type RegisterValues } from "@/utils/validation";

function RegisterForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("redirect"));
  const { user, isLoading } = useAuth();
  const [show, setShow] = useState(false);
  const [image, setImage] = useState<ImageValue>({ file: null, url: "" });
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), mode: "onChange", defaultValues: { name: "", email: "", password: "" } });
  const passwordValue = watch("password") ?? "";
  const rules = [
    { ok: passwordValue.length >= 6, label: "At least 6 characters" },
    { ok: /[A-Z]/.test(passwordValue), label: "One uppercase letter" },
    { ok: /[a-z]/.test(passwordValue), label: "One lowercase letter" },
  ];

  useEffect(() => {
    if (!isLoading && user) router.replace(destinationFor(user.role, next));
  }, [isLoading, user, next, router]);

  async function onSubmit(values: RegisterValues) {
    try {
      let imageUrl = image.url.trim();
      if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
        toast.error("Profile image URL must start with http:// or https://");
        return;
      }
      if (image.file) imageUrl = await uploadImage(image.file);

      // Public sign-up can only ever create a customer: the server ignores/forbids any role input.
      const { data, error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        ...(imageUrl ? { image: imageUrl } : {}),
      });
      if (error || !data) {
        const msg = error?.message || "Could not create your account";
        // Show server-side problems under the matching field instead of only a toast
        if (/password/i.test(msg)) setError("password", { type: "server", message: msg });
        else if (/email|already|exist/i.test(msg)) setError("email", { type: "server", message: msg });
        else toast.error(msg);
        return;
      }
      toast.success("Account created. Welcome to SalonBook!");
      router.replace(destinationFor("customer", next));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <h1 className="text-4xl">Create your account</h1>
      <p className="mt-2 text-charcoal-600">Book services and track every appointment in one place.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <Field label="Full name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" placeholder="Your full name" invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} autoComplete="new-password" className="pr-11" invalid={!!errors.password} {...register("password")} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500" aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-xs" aria-label="Password requirements">
            {rules.map((r) => (
              <li key={r.label} className={r.ok ? "text-emerald-600" : passwordValue ? "text-red-600" : "text-charcoal-500"}>
                {r.ok ? "✓" : "•"} {r.label}
              </li>
            ))}
          </ul>
        </Field>
        <div>
          <p className="mb-1.5 text-sm font-medium text-charcoal-800">Profile image (optional)</p>
          <ImageInput value={image} onChange={setImage} />
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs text-charcoal-500">
        <span className="h-px flex-1 bg-sand-300" /> or <span className="h-px flex-1 bg-sand-300" />
      </div>
      <GoogleButton next={next} label="Sign up with Google" />

      <p className="mt-8 text-center text-sm text-charcoal-600">
        Already have an account?{" "}
        <Link href={next ? `/login?redirect=${encodeURIComponent(next)}` : "/login"} className="font-medium text-blush-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
