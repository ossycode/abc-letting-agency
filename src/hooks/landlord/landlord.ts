// hooks/landlords.ts
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { landlordApi } from "@/lib/apiServices/lanlord/landlord";
import { FilterRuleWire, PagedList, QueryOptions } from "@/types/shared";
import {
  CreateLandlordRequest,
  LandlordDto,
  UpdateLandlordRequest,
} from "@/types/landlord";

/** ===== Query Keys ===== */
export const landlordKeys = {
  all: ["landlords"] as const,
  list: (opts?: QueryOptions, filters?: FilterRuleWire[]) =>
    [
      ...landlordKeys.all,
      "list",
      { opts: opts ?? {}, filters: filters ?? [] },
    ] as const,
  detail: (id: string) => [...landlordKeys.all, "detail", id] as const,
};

/** ===== Queries ===== */
export function useLandlords(
  params?: { opts?: QueryOptions; filters?: FilterRuleWire[] },
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery<PagedList<LandlordDto>>({
    queryKey: landlordKeys.list(params?.opts, params?.filters),
    queryFn: () => landlordApi.getAll(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useLandlord(
  id: string | undefined,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery<LandlordDto>({
    queryKey: id ? landlordKeys.detail(id) : landlordKeys.detail("nil"),
    queryFn: () => landlordApi.getById(id as string),
    enabled: !!id && (options?.enabled ?? true),
  });
}

/** ===== Mutations ===== */
export function useCreateLandlord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLandlordRequest) => landlordApi.create(payload),
    onSuccess: async (created) => {
      // Invalidate lists and seed detail cache
      await qc.invalidateQueries({ queryKey: landlordKeys.all });
      qc.setQueryData(landlordKeys.detail(created.id), created);
    },
  });
}

export function useUpdateLandlord(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLandlordRequest) =>
      landlordApi.update(id, payload),
    onSuccess: async (updated) => {
      qc.setQueryData(landlordKeys.detail(updated.id), updated);
      await qc.invalidateQueries({
        queryKey: landlordKeys.list(undefined, undefined),
      });
    },
  });
}

export function useDeleteLandlord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => landlordApi.remove(id),
    onSuccess: async (_ok, id) => {
      // Drop detail cache and refresh lists
      qc.removeQueries({ queryKey: landlordKeys.detail(id) });
      await qc.invalidateQueries({ queryKey: landlordKeys.all });
    },
  });
}
