"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { patchApiUser, UpdateMeRequest } from "@/api/sdk";
import {
  getApiUserOptions,
  getApiUserQueryKey,
} from "@/api/sdk/@tanstack/react-query.gen";
import { UserMeDto } from "@/types/user";
import { normalizeResponse } from "@/types/shared";

type MeKey = ReturnType<typeof getApiUserQueryKey>;

// Allow consumers to pass extra options, but DON'T let them override queryKey/queryFn
type MeOptions = Omit<
  UseQueryOptions<unknown, Error, UserMeDto | null, MeKey>,
  "queryKey" | "queryFn" | "select"
> & {
  select?: (v: UserMeDto | null) => UserMeDto | null;
};

export function useMe(options?: MeOptions) {
  const base = getApiUserOptions();
  const userSelect = options?.select;

  return useQuery<unknown, Error, UserMeDto | null, MeKey>({
    ...base,
    select: (raw: unknown): UserMeDto | null => {
      const normalized = normalizeResponse<UserMeDto>(raw);
      return userSelect ? userSelect(normalized) : normalized;
    },
    staleTime: 60_000,
    retry: 1,
    ...(options && { ...options, select: undefined }),
  });
}
export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateMeRequest) => patchApiUser({ body }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getApiUserOptions().queryKey }),
  });
}

// export function useMe() {
//   return useQuery<UserMeDto>({
//     queryKey: ['me'],
//     queryFn: () => withRefresh(() => getApiUser()),
//     staleTime: 60_000,
//     retry: 1,
//   });
// }

// export function useUpdateMe() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (body: UpdateMeRequest) =>
//       withRefresh(() => patchApiUser({ requestBody: body })),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
//   });
// }

// Example login using the BFF
export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    },
    onSuccess: () => qc.resetQueries({ queryKey: ["me"] }),
  });
};
