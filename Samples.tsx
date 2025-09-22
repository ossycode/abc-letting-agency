// app/(protected)/layout.tsx
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAccess = !!(await cookies()).get("ACCESS_TOKEN")?.value;
  if (!hasAccess)
    redirect(
      `/login?returnTo=${encodeURIComponent(
        (await headers()).get("x-invoke-path") ?? "/"
      )}`
    );
  return <>{children}</>;
}
