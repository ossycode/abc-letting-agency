"use client";

import { useMemo } from "react";
import { useMe } from "./useMe";

export function useAuth() {
  const q = useMe();
  const roles = useMemo(() => new Set(q.data?.roles ?? []), [q.data]);
  const perms = useMemo(() => new Set(q.data?.permissions ?? []), [q.data]);

  const hasRole = (r: string) => roles.has(r);
  const hasPermission = (p: string) => perms.has(p);

  return {
    ...q, // data, isLoading, isError, etc.
    me: q.data,
    isAuthenticated: !!q.data,
    hasRole,
    hasPermission,
  };
}
