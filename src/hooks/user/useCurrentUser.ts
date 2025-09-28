import { useMemo } from "react";
import { useMe } from "./useUser";

export function useCurrentUser() {
  const q = useMe();

  const roles = useMemo(() => new Set(q.data?.roles ?? []), [q.data]);
  const perms = useMemo(() => new Set(q.data?.permissions ?? []), [q.data]);

  const hasRole = (r: string) => roles.has(r);
  const hasAnyRole = (...rs: string[]) => rs.some((r) => roles.has(r));
  const hasAllRoles = (...rs: string[]) => rs.every((r) => roles.has(r));

  const hasPermission = (p: string) => perms.has(p);
  const hasAnyPermission = (...ps: string[]) => ps.some((p) => perms.has(p));
  const hasAllPermissions = (...ps: string[]) => ps.every((p) => perms.has(p));

  return {
    ...q,
    me: q.data,
    isAuthenticated: !!q.data,
    roles,
    perms,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
