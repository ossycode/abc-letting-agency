"use client";

import { client } from "@/api/sdk/client.gen";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5171");

client.setConfig({
  baseUrl: BASE,
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  throwOnError: false,
});

type ResInterceptor = Parameters<typeof client.interceptors.response.use>[0];

let refreshing: Promise<Response> | null = null;

const refreshAndRetry: ResInterceptor = async (response, request, options) => {
  if (response.status !== 401) return response;

  const base = client.getConfig().baseUrl ?? BASE;
  const path = new URL(options.url ?? "", base).pathname;
  if (path.endsWith("/api/auth/refresh")) return response;

  const alreadyRetried =
    (options.headers instanceof Headers
      ? options.headers.get("x-retried-401")
      : Array.isArray(options.headers)
      ? options.headers.find(([k]) => k.toLowerCase() === "x-retried-401")?.[1]
      : (options.headers as Record<string, string> | undefined)?.[
          "x-retried-401"
        ]) === "1";
  if (alreadyRetried) return response;

  if (!refreshing) {
    refreshing = fetch(new URL("/api/auth/refresh", base).toString(), {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    }).finally(() => {
      refreshing = null;
    });
  }

  const rr = await refreshing;

  if (!rr.ok) return response;

  const hdrs = new Headers(options.headers as HeadersInit | undefined);
  hdrs.set("x-retried-401", "1");

  const result = await client.request({
    ...options,
    method:
      options.method ?? (request.method as NonNullable<typeof options.method>),
    headers: hdrs,
  });

  return result.response;
};

client.interceptors.response.use(refreshAndRetry);
