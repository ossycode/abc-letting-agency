import { propertyApi } from "@/lib/apiServices/property";
import {
  CreatePropertyRequest,
  PropertyDto,
  propertyKeys,
  UpdatePropertyRequest,
} from "@/types/property";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProperty(id: string, enabled = true) {
  return useQuery<PropertyDto>({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyApi.getById(id),
    enabled,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePropertyRequest) => propertyApi.create(payload),
    onSuccess: (created) => {
      // invalidate lists, seed the detail cache
      qc.invalidateQueries({ queryKey: propertyKeys.all });
      qc.setQueryData(propertyKeys.detail(created.id), created);
    },
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePropertyRequest) =>
      propertyApi.update(id, payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({
        queryKey: propertyKeys.list(undefined, undefined),
      });
      qc.setQueryData(propertyKeys.detail(updated.id), updated);
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertyApi.remove(id),
    onSuccess: (_ok, id) => {
      // Drop the detail cache for this item and refresh lists
      qc.removeQueries({ queryKey: propertyKeys.detail(id) });
      qc.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
}
