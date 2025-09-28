/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProblemDetails } from "@/types/shared";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import qs from "qs";

/**
 * Create a single axios instance used across the app.
 * - Sends cookies (httpOnly) with every request.
 * - Retries once on 401 by calling /api/auth/refresh, then replays the original request.
 * - Uses a mutex so only one refresh runs at a time.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const REFRESH_URL = "/api/auth/refresh";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public payload?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type PendingRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let queue: PendingRequest[] = [];

// Instance used for normal calls
export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  paramsSerializer: (p) =>
    qs.stringify(p, {
      arrayFormat: "indices",
      encodeValuesOnly: true,
      skipNulls: true,
    }),
});

// A second instance that bypasses the response interceptor to avoid infinite loops
const axiosBare: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Response interceptor:
 * - On 401 once, call /api/auth/refresh
 * - Replay original request after refresh succeeds
 * - If refresh fails, reject and let the UI handle logout/redirect
 */

axiosClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;

    // Try refresh on 401 exactly once
    if (originalRequest && status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        await new Promise((resolve, reject) => queue.push({ resolve, reject }));
        return axiosClient(originalRequest);
      }

      isRefreshing = true;
      try {
        await axiosBare.post(REFRESH_URL);
        queue.forEach((p) => p.resolve());
        queue = [];
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        queue.forEach((p) => p.reject(refreshErr));
        queue = [];
        const status = (refreshErr as any)?.response?.status ?? 401;
        if (status === 401) {
          if (typeof window !== "undefined") {
            (await import("@/lib/authEvents")).authEvents.emitUnauthorized();
          }
        }
        throw refreshErr;
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize *any* other failure shape into ApiError
    const data = error.response?.data as ProblemDetails;
    const msg =
      // ASP.NET ProblemDetails
      (typeof data === "object" && data?.title) ||
      (typeof data === "object" && data?.detail) ||
      // { errors: { field: [msg] } }
      (typeof data === "object" &&
        data?.errors &&
        Object.values(data.errors)?.[0]?.[0]) ||
      // string[] body
      (Array.isArray(data) && typeof data[0] === "string" && data[0]) ||
      // plain string body
      (typeof data === "string" && data) ||
      // axios message fallback
      error.message ||
      "Request failed";

    throw new ApiError(msg as string, status, data);
  }
);
