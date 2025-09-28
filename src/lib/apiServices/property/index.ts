import { axiosClient } from "@/lib/axiosClient";
import {
  CreatePropertyRequest,
  PropertyDto,
  UpdatePropertyRequest,
} from "@/types/property";
import { FilterRuleWire, PagedList, QueryOptions } from "@/types/shared";

const base = "/api/properties";

export const propertyApi = {
  async getAll(params?: { opts?: QueryOptions; filters?: FilterRuleWire[] }) {
    const res = await axiosClient.get<PagedList<PropertyDto>>(base, {
      params: {
        ...params?.opts,
        filters: params?.filters,
      },
    });
    return res.data;
  },

  async getById(id: string) {
    const res = await axiosClient.get<PropertyDto>(
      `${base}/${encodeURIComponent(id)}`
    );
    return res.data;
  },

  async create(payload: CreatePropertyRequest) {
    const res = await axiosClient.post<PropertyDto>(base, payload);
    return res.data;
  },

  async update(id: string, payload: UpdatePropertyRequest) {
    const res = await axiosClient.patch<PropertyDto>(
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
