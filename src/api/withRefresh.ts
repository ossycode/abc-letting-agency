export async function withRefresh<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.response?.status;
    if (status === 401) {
      const r = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (r.ok) return await fn();
    }
    throw err;
  }
}
