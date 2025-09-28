// apiServices/landlord.ts

import { axiosClient } from "@/lib/axiosClient";
import {
  CreateLandlordRequest,
  LandlordDto,
  UpdateLandlordRequest,
} from "@/types/landlord";
import { FilterRuleWire, PagedList, QueryOptions } from "@/types/shared";

/** ===== Service ===== */
const base = "/api/landlord";

export const landlordApi = {
  /** GET /api/landlord */
  async getAll(params?: { opts?: QueryOptions; filters?: FilterRuleWire[] }) {
    // The axios client should have a paramsSerializer (qs) that supports arrays:
    // filters: [{ field, op, value }, ...] -> filters[0].field=... etc.
    const res = await axiosClient.get<PagedList<LandlordDto>>(base, {
      params: {
        ...params?.opts,
        // backend signature: [FromQuery] QueryOptions opts, [FromQuery] List<FilterRule>? filters
        filters: params?.filters,
      },
    });
    return res.data;
  },

  /** GET /api/landlord/{id} */
  async getById(id: string) {
    const res = await axiosClient.get<LandlordDto>(
      `${base}/${encodeURIComponent(id)}`
    );
    return res.data;
  },

  /** POST /api/landlord */
  async create(payload: CreateLandlordRequest) {
    const res = await axiosClient.post<LandlordDto>(base, payload);
    return res.data;
  },

  /** PATCH /api/landlord/{id} */
  async update(id: string, payload: UpdateLandlordRequest) {
    const res = await axiosClient.patch<LandlordDto>(
      `${base}/${encodeURIComponent(id)}`,
      payload
    );
    return res.data;
  },

  /** DELETE /api/landlord/{id} */
  async remove(id: string) {
    await axiosClient.delete<void>(`${base}/${encodeURIComponent(id)}`);
    return true;
  },
};
