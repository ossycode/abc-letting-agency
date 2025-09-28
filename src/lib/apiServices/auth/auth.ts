import { axiosClient } from "@/lib/axiosClient";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { ApiResult } from "@/types/shared";

/**
 * NOTE:
 * The server sets/clears cookies; we just call endpoints.
 */

export const authApi = {
  register: async (payload: RegisterRequest) => {
    const { data } = await axiosClient.post<ApiResult<unknown>>(
      "/api/auth/register",
      payload
    );
    return data;
  },

  login: async (payload: LoginRequest) => {
    const { data } = await axiosClient.post<ApiResult<unknown>>(
      "/api/auth/login",
      payload
    );
    return data;
  },

  logout: async () => {
    const { data } = await axiosClient.post<ApiResult<unknown>>(
      "/api/auth/logout"
    );
    return data;
  },

  refresh: async () => {
    // Usually not needed directly — interceptor handles it — but exposed for edge cases.
    const { data } = await axiosClient.post<ApiResult<unknown>>(
      "/api/auth/refresh"
    );
    return data;
  },
};
