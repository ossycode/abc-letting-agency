import { userKeys } from "@/helper";
import { userApi } from "@/lib/apiServices/user/user";
import {
  ChangePasswordRequest,
  DeleteMeRequest,
  UpdateMeRequest,
  User,
} from "@/types/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useMe(options?: { enabled?: boolean }) {
  return useQuery<User | null>({
    queryKey: userKeys.me(),
    queryFn: async () => {
      try {
        return await userApi.getMe(); // GET /api/user
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const status = err?.response?.status ?? err?.status;
        if (status === 401) return null; // unauthenticated → null
        throw err; // surface real errors
      }
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMeRequest) => userApi.updateMe(payload),
    onSuccess: (updated) => {
      qc.setQueryData(userKeys.me(), updated);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      userApi.changePassword(payload),
  });
}

export function useDeleteMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteMeRequest) => userApi.deleteMe(payload),
    onSuccess: () => {
      qc.removeQueries({ queryKey: userKeys.all() });
    },
  });
}
