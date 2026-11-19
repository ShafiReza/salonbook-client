"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Info } from "lucide-react";
import { useEffect } from "react";
import { BookingForm } from "@/components/services/BookingForm";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { SafeImage } from "@/components/ui/Media";
import { LinkButton } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { formatDuration, formatPrice } from "@/lib/utils";
import { servicesApi } from "@/services/endpoints";

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-sand-100 p-4 text-sm text-charcoal-700">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blush-600" />
      <div>{children}</div>
    </div>
  );
}

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: service, loading, error, reload } = useAsync(() => servicesApi.get(id), [id]);

  useEffect(() => {
    if (!authLoading && !user) router.replace(`/login?redirect=${encodeURIComponent(`/services/${id}`)}`);
  }, [authLoading, user, id, router]);

  if (authLoading || !user || loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message={error ?? "Service not found"} onRetry={error?.includes("reach") ? reload : undefined} backHref="/services" />
      </div>
    );
  }

  const bookable = service.status === "active";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/services" className="mb-6 inline-flex items-center gap-1.5 text-sm text-charcoal-600 hover:text-charcoal-900">
        <ArrowLeft className="h-4 w-4" /> All services
      </Link>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SafeImage src={service.image} alt={service.serviceName} className="aspect-[4/3] w-full rounded-3xl object-cover" />
        </div>
        <div>
          <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-blush-700">{service.category}</span>
          <h1 className="mt-4 text-4xl sm:text-5xl">{service.serviceName}</h1>
          <div className="mt-4 flex items-center gap-5">
            <span className="font-display text-4xl text-blush-700">{formatPrice(service.price)}</span>
            <span className="flex items-center gap-1.5 text-charcoal-600">
              <Clock className="h-4 w-4" /> {formatDuration(service.duration)}
            </span>
          </div>
          <p className="mt-6 whitespace-pre-line leading-relaxed text-charcoal-700">{service.description}</p>

          <div className="mt-8 rounded-3xl border border-sand-200 bg-white p-6">
            <h2 className="mb-5 text-2xl">Book this service</h2>
            {!bookable ? (
              <Notice>This service is currently unavailable for booking. Please browse our other services.</Notice>
            ) : user.role === "admin" ? (
              <Notice>You are signed in as an admin. Only customer accounts can book appointments.</Notice>
            ) : user.isBlocked ? (
              <Notice>Your account is blocked, so new bookings are disabled.</Notice>
            ) : (
              <BookingForm service={service} />
            )}
            {!bookable && (
              <LinkButton href="/services" variant="outline" className="mt-4">
                Browse available services
              </LinkButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
