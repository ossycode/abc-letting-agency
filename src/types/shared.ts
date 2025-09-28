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

export type ApiResult<T> = {
  isSuccess: boolean;
  value?: T;
  errors?: string[];
};

export type QueryOptions = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
  search?: string;
  searchFields?: string[];
};

export type FilterRule = {
  field: string;
  op:
    | "eq"
    | "neq"
    | "lt"
    | "lte"
    | "gt"
    | "gte"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "in"
    | "nin";
  value: string;
};

export type FilterRuleWire = {
  field: string;
  op: string;
  value: string;
};

export type PagedList<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export const toWireFilters = (
  filters?: FilterRule[]
): FilterRuleWire[] | undefined =>
  filters?.length
    ? filters.map((f) => ({
        field: f.field,
        op: f.op, // <- widen to string is fine
        value: Array.isArray(f.value) ? f.value.join(",") : String(f.value),
      }))
    : undefined;
