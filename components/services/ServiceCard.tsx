import Link from "next/link";
import { Clock } from "lucide-react";
import type { Service } from "@/types";
import { formatDuration, formatPrice } from "@/lib/utils";
import { SafeImage } from "../ui/Media";
import { Skeleton } from "../ui/Feedback";
import { buttonClasses } from "../ui/Button";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-sand-200 bg-white transition-shadow hover:shadow-lg hover:shadow-charcoal-900/5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage src={service.image} alt={service.serviceName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-charcoal-800">{service.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl leading-snug">{service.serviceName}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-charcoal-600">{service.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-display text-2xl text-blush-700">{formatPrice(service.price)}</span>
          <span className="flex items-center gap-1.5 text-charcoal-600">
            <Clock className="h-4 w-4" /> {formatDuration(service.duration)}
          </span>
        </div>
        <Link href={`/services/${service._id}`} className={buttonClasses("outline", "md", "mt-4 w-full")}>
          View Details
        </Link>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}
