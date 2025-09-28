/* eslint-disable @typescript-eslint/no-explicit-any */
export const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
  e.stopPropagation();
};

export const userKeys = {
  all: () => ["user"] as const,
  me: () => ["user", "me"] as const,
};

export function applyProblemDetailsToForm(
  err: unknown,
  setError: (name: any, err: { type: string; message: string }) => void
): string | null {
  // axios error?
  const ax = err as any;
  const data = ax?.response?.data ?? ax?.data ?? err;

  const errorsBag =
    data?.errors || // ProblemDetails.errors
    data?.Extensions?.errors || // sometimes nested
    undefined;

  if (errorsBag && typeof errorsBag === "object") {
    Object.entries(errorsBag).forEach(([key, messages]) => {
      const msg = Array.isArray(messages) ? messages[0] : String(messages);
      // map server casing to your fields if needed (e.g. "Email" -> "email")
      const k = key.charAt(0).toLowerCase() + key.slice(1);
      setError(k as any, { type: "server", message: msg });
    });
    return null;
  }

  // generic top-level message
  return data?.title || data?.message || ax?.message || "Request failed.";
}
