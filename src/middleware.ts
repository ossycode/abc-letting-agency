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

// export async function middleware(req: NextRequest) {
//   const { pathname, search } = req.nextUrl;

//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/public") ||
//     pathname.startsWith("/api/auth") ||
//     pathname === "/favicon.ico"
//   ) {
//     return NextResponse.next();
//   }

//   const hasAccess = !!req.cookies.get("ACCESS_TOKEN")?.value;
//   const hasRefresh = !!req.cookies.get("REFRESH_TOKEN")?.value;

//   if (AUTH_PAGES.includes(pathname) && hasAccess) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
//   if (!isProtected) return NextResponse.next();

//   // If access is present, proceed
//   if (hasAccess) return NextResponse.next();

//   // Try silent refresh if refresh token exists
//   if (hasRefresh) {
//     const refreshUrl = new URL("/api/auth/refresh", API_BASE).toString();
//     const refreshRes = await fetch(refreshUrl, {
//       method: "POST",
//       // Forward incoming cookies to API so it can see REFRESH_TOKEN
//       cache: "no-store",
//       headers: { cookie: req.headers.get("cookie") ?? "" },
//     });

//     if (refreshRes.ok) {
//       // Copy Set-Cookie from API response to the browser response
//       const res = NextResponse.next();

//       // Next 14+ usually exposes getSetCookie(); fallback to single header if needed
//       const setCookies: string[] =
//         refreshRes.headers.getSetCookie?.() ??
//         (refreshRes.headers.get("set-cookie")
//           ? [refreshRes.headers.get("set-cookie") as string]
//           : []);

//       for (const c of setCookies) res.headers.append("set-cookie", c);
//       return res;
//     }
//   }

//   // No access & refresh failed → redirect
//   const signinUrl = new URL("/", req.url);
//   signinUrl.searchParams.set("returnTo", pathname + search);
//   return NextResponse.redirect(signinUrl);
// }
// Run middleware only where you need it (faster)
// Option A: wide matcher + internal allowlist (above)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|api/auth).*)"],
};
