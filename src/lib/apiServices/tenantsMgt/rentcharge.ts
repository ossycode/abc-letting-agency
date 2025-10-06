import { axiosClient } from "@/lib/axiosClient";
import { PagedList } from "@/types/shared";
import { RentChargeCreateModel, RentChargeDto } from "@/types/tenantMgt";

const base = "/api/rentcharge";

export const rentChargeApi = {
  async listByTenancy(tenancyId: string) {
    const filters = [{ field: "TenancyId", op: "eq", value: tenancyId }];
    const res = await axiosClient.get<PagedList<RentChargeDto>>(base, {
      params: { page: 1, pageSize: 50, filters },
    });
    return res.data;
  },

  async create(payload: RentChargeCreateModel) {
    const res = await axiosClient.post<RentChargeDto>(base, payload);
    return res.data;
  },
};
