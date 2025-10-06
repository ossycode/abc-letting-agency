import { axiosClient } from "@/lib/axiosClient";
import { PagedList } from "@/types/shared";
import {
  CreateTenantRequest,
  TenantDto,
  UpdateTenantRequest,
} from "@/types/tenantMgt";

const base = "/api/tenant";

export const tenantApi = {
  async search(query: string) {
    // Your controller supports Paged + filters; build filter rules
    const filters = [
      // backend FilterRule: { field, op, value }
      { field: "Email", op: "contains", value: query },
      { field: "Phone", op: "contains", value: query },
      { field: "FirstName", op: "contains", value: query },
      { field: "LastName", op: "contains", value: query },
    ];
    const res = await axiosClient.get<PagedList<TenantDto>>(base, {
      params: { page: 1, pageSize: 20, filters },
    });
    return res.data;
  },

  async create(payload: CreateTenantRequest) {
    const res = await axiosClient.post<TenantDto>(base, payload);
    return res.data;
  },

  async update(id: string, payload: UpdateTenantRequest) {
    const res = await axiosClient.patch<TenantDto>(
      `${base}/${encodeURIComponent(id)}`,
      payload
    );
    return res.data;
  },

  async remove(id: string) {
    await axiosClient.delete<void>(`${base}/${encodeURIComponent(id)}`);
    return true;
  },
};

// export function useTenantSearch(query: string, enabled = true) {
//   return useQuery<PagedList<TenantDto>>({
//     queryKey: tenantKeys.search(query),
//     queryFn: () => tenantApi.search(query),
//     enabled: enabled && query.trim().length >= 2,
//     placeholderData: keepPreviousData,
//   });
// }
