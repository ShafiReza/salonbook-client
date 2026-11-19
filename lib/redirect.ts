/** Only allow same-site relative paths as post-login destinations (prevents open redirects). */
export function safeNext(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return null;
  return next;
}

export function homeFor(role: string | undefined): string {
  return role === "admin" ? "/admin" : "/dashboard";
}

/** Admins are never sent to customer-only pages and vice versa. */
export function destinationFor(role: string | undefined, next: string | null): string {
  if (!next) return homeFor(role);
  if (role === "admin") return next.startsWith("/admin") ? next : "/admin";
  return next.startsWith("/admin") ? "/dashboard" : next;
}
