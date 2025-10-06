import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_PAGES = ["/login", "/register", "/forgot-password"];
const protectedPrefixes = ["/app", "/portal"];

const PROD_DOMAIN = "cvedup.com";
const ROOTS = new Set([`cvedup.com`, `www.cvedup.com`]);
const PUBLIC_PREFIXES = ["/_next", "/assets", "/api/auth", "/favicon.ico"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;

  // allow internal/static
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  const isDev = process.env.NODE_ENV !== "production";

  const hasAccess = !!req.cookies.get("ACCESS_TOKEN")?.value;
  const hasRefresh = !!req.cookies.get("REFRESH_TOKEN")?.value;
  const isAuthedOrRefreshable = hasAccess || hasRefresh;
  const tenantSlug = req.cookies.get("AGENCY_TOKEN")?.value.toLowerCase() || "";

  if (isDev) {
    // prevent authed users from seeing auth pages
    if (isAuthedOrRefreshable && AUTH_PAGES.includes(pathname)) {
      return NextResponse.redirect(new URL("/app", req.url));
    }
    // protect /app and /portal only

    const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
    if (isProtected && !isAuthedOrRefreshable) {
      const login = new URL("/login", req.url);
      login.searchParams.set("returnTo", pathname + url.search);
      return NextResponse.redirect(login);
    }
    // Agency users should never see /portal in dev either
    if (pathname.startsWith("/portal") && tenantSlug) {
      return NextResponse.redirect(new URL("/app", req.url));
    }
    return NextResponse.next();
  }

  // --- PROD: enforce subdomain if tenant exists
  const isRootHost = ROOTS.has(host);
  const isTenantHost = host.endsWith(`.${PROD_DOMAIN}`) && !isRootHost;

  // Agency users must not access /portal
  if (pathname.startsWith("/portal") && tenantSlug) {
    // send them to their app home on their subdomain (or root if no slug)
    const dest = new URL(req.url);
    dest.pathname = "/app";
    dest.search = url.search;
    if (tenantSlug) dest.host = `${tenantSlug}.${PROD_DOMAIN}`;
    return NextResponse.redirect(dest);
  }

  // Redirect signed-in root visitors to their tenant subdomain
  if (isRootHost && isAuthedOrRefreshable && tenantSlug) {
    const dest = new URL(req.url);
    dest.host = `${tenantSlug}.${PROD_DOMAIN}`;
    return NextResponse.redirect(dest);
  }

  // If they’re on a tenant host but TENANT cookie is different/missing, normalize
  if (isTenantHost && tenantSlug) {
    const currentSlug = host.replace(`.${PROD_DOMAIN}`, "");
    if (currentSlug.toLowerCase() !== tenantSlug.toLowerCase()) {
      const dest = new URL(req.url);
      dest.host = `${tenantSlug}.${PROD_DOMAIN}`;
      return NextResponse.redirect(dest);
    }
  }

  // Protect tenant areas: if not authed, send them to root login
  const isProtected =
    pathname.startsWith("/app") || pathname.startsWith("/portal");
  if (isProtected && !isAuthedOrRefreshable) {
    const login = new URL(`https://${PROD_DOMAIN}/login`);
    login.searchParams.set("returnTo", pathname + url.search);
    return NextResponse.redirect(login);
  }

  // Authed users shouldn’t see auth pages
  if (isAuthedOrRefreshable && AUTH_PAGES.includes(pathname)) {
    const dest = isTenantHost ? "/app" : `https://${PROD_DOMAIN}/app`;
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|api/auth).*)"],
};
