import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PropertyDto, propertyKeys } from "@/types/property";
import { FilterRuleWire, PagedList, QueryOptions } from "@/types/shared";
import { propertyApi } from "@/lib/apiServices/property";

/** Query key factory so we keep keys consistent */

export function useProperties(params?: {
  opts?: QueryOptions;
  filters?: FilterRuleWire[];
}) {
  return useQuery<PagedList<PropertyDto>>({
    queryKey: propertyKeys.list(params?.opts, params?.filters),
    queryFn: () => propertyApi.getAll(params),
    placeholderData: keepPreviousData,
  });
}
