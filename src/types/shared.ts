/* eslint-disable @typescript-eslint/no-explicit-any */
export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
};

export type ResultEnvelope<T> = {
  isSuccess: boolean;
  value?: T | null;
  error?: {
    code: string;
    message: string;
    details?: Array<{ key?: string; value: string }>;
  };
  errors?: Array<{ key?: string; message: string }>;
};

export function isResultEnvelope<T = unknown>(
  data: any
): data is ResultEnvelope<T> {
  return data && typeof data === "object" && "isSuccess" in data;
}

export function isProblem(data: any): data is ProblemDetails {
  return (
    data && typeof data === "object" && ("status" in data || "title" in data)
  );
}

export function normalizeResponse<T>(data: any): T | null {
  if (isResultEnvelope<T>(data)) {
    if (!data.isSuccess) {
      const fromDetails = data.error?.details?.map((d) => d.value).join("; ");
      const fromErrors = data.errors?.map((e) => e.message).join("; ");
      const msg =
        data.error?.message || fromDetails || fromErrors || "Request failed.";
      throw new Error(msg);
    }
    return (data.value ?? null) as T | null;
  }

  if (isProblem(data)) {
    const msg = data.title || data.detail || "Request failed.";
    throw new Error(msg);
  }
  return data as T;
}

export type PagedList<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};
