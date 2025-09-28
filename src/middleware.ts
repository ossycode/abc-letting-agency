import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_PAGES = ["/", "/login"];
const PROTECTED = ["/app"];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // allow internal/static
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const hasAccess = !!req.cookies.get("ACCESS_TOKEN")?.value;
  const hasRefresh = !!req.cookies.get("REFRESH_TOKEN")?.value;
  const isAuthedOrRefreshable = hasAccess || hasRefresh;

  // ✅ Signed-in (or refreshable) users shouldn't see login or root
  if (AUTH_PAGES.includes(pathname) && isAuthedOrRefreshable) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  // ✅ Only guard protected sections
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) {
    // If it's exactly "/", and not logged in, send to /login (your rule)
    if (pathname === "/" && !isAuthedOrRefreshable) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ✅ If access is valid -> allow
  if (hasAccess) return NextResponse.next();

  // ✅ If access expired but refresh exists -> allow.
  // Your client interceptor will refresh on the first API call.
  if (hasRefresh) return NextResponse.next();

  // ❌ Neither cookie -> go to login
  const signinUrl = new URL("/login", req.url);
  signinUrl.searchParams.set("returnTo", pathname + search);
  return NextResponse.redirect(signinUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|api/auth).*)"],
};
