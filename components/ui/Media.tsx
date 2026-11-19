"use client";

import { Scissors } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, initials } from "@/lib/utils";

/** <img> with a graceful placeholder when the URL is missing or fails to load. */
export function SafeImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div className={cn("flex items-center justify-center bg-gradient-to-br from-blush-100 to-sand-200 text-blush-400", className)} role="img" aria-label={alt}>
        <Scissors className="h-8 w-8" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />;
}

export function Avatar({ src, name, className }: { src?: string | null; name?: string | null; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (src && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name ?? "Profile"} onError={() => setFailed(true)} className={cn("h-9 w-9 rounded-full object-cover", className)} />;
  }
  return (
    <span className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 text-xs font-semibold text-blush-700", className)}>
      {initials(name)}
    </span>
  );
}
