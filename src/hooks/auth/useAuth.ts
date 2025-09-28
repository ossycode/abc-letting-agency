import { userKeys } from "@/helper";
import { authApi } from "@/lib/apiServices/auth/auth";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    onSuccess: async () => {
      // Optional: after register, the server may log the user in. If so, refetch /api/user.
      await qc.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: async () => {
      // Access cookie is set by server; pull fresh user
      await qc.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

export function useLogout(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      // Clear user cache
      await qc.invalidateQueries({ queryKey: userKeys.me() });
      qc.setQueryData(userKeys.me(), null);
      opts?.onSuccess?.();
    },
  });
}
