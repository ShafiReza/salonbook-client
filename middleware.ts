import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// First line of defence (cookie presence). Role checks happen in <RouteGuard/> and, authoritatively, on the API.
export function middleware(req: NextRequest) {
  if (!getSessionCookie(req)) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // "/services/:path+" protects service details (/services/<id>) but leaves the public /services listing open
  matcher: ["/dashboard/:path*", "/admin/:path*", "/services/:path+"],
};
