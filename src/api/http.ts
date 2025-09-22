// export type ApiFetchArgs = {
//   url: string;
//   options?: RequestInit;
// };

// export async function apiFetch<T>({ url, options }: ApiFetchArgs): Promise<T> {
//   const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
//   const res = await fetch(`${base}${url}`, {
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...(options?.headers || {}),
//     },
//     ...options,
//     cache: "no-store",
//     next: { revalidate: 0 },
//   });
//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
//   }
//   return (res.status === 204 ? (undefined as T) : await res.json()) as T;
// }
