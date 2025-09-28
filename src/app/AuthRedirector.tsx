"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authEvents } from "@/lib/authEvents";

export default function AuthRedirector() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams()?.toString() ?? "";
  const qc = useQueryClient();

  useEffect(() => {
    return authEvents.onUnauthorized(() => {
      if (pathname?.startsWith("/login")) return;
      try {
        qc.clear();
      } catch {}
      const returnTo = pathname
        ? `${pathname}${search ? `?${search}` : ""}`
        : "/";
      router.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    });
  }, [qc, router, pathname, search]);

  return null;
}
