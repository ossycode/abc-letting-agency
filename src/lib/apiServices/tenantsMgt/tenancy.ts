import { axiosClient } from "@/lib/axiosClient";
import { FilterRuleWire, PagedList } from "@/types/shared";
import {
  CreateTenancyRequest,
  SetNextChargeDateRequest,
  StartTenancyRequest,
  TenancyDto,
  UpdateBillingScheduleRequest,
  UpdateOccupant,
  UpdateTenancyRequest,
  UpdateTenancyStatusRequest,
} from "@/types/tenantMgt";
import { QueryOptions } from "@tanstack/react-query";

const base = "/api/tenancy";

export const tenancyApi = {
  async get(id: string) {
    const res = await axiosClient.get<TenancyDto>(
      `${base}/${encodeURIComponent(id)}`
    );
    return res.data;
  },

  async list(params?: { opts?: QueryOptions; filters?: FilterRuleWire[] }) {
    const res = await axiosClient.get<PagedList<TenancyDto>>(base, {
      params: { ...params?.opts, filters: params?.filters },
    });
    return res.data;
  },

  async create(payload: CreateTenancyRequest) {
    const res = await axiosClient.post<TenancyDto>(base, payload);
    return res.data;
  },

  async update(id: string, payload: UpdateTenancyRequest) {
    const res = await axiosClient.patch<void>(
      `${base}/${encodeURIComponent(id)}`,
      payload
    );
    return res.data;
  },

  async remove(id: string) {
    await axiosClient.delete<void>(`${base}/${encodeURIComponent(id)}`);
    return true;
  },

  async updateStatus(id: string, payload: UpdateTenancyStatusRequest) {
    const res = await axiosClient.patch<void>(
      `${base}/${encodeURIComponent(id)}/status`,
      payload
    );
    return res.data;
  },

  async updateBilling(id: string, payload: UpdateBillingScheduleRequest) {
    const res = await axiosClient.patch<void>(
      `${base}/${encodeURIComponent(id)}/billing-schedule`,
      payload
    );
    return res.data;
  },

  async setNextChargeDate(id: string, payload: SetNextChargeDateRequest) {
    const res = await axiosClient.patch<void>(
      `${base}/${encodeURIComponent(id)}/next-charge-date`,
      payload
    );
    return res.data;
  },

  async replaceOccupants(id: string, occupants: UpdateOccupant[]) {
    const res = await axiosClient.put<void>(
      `${base}/${encodeURIComponent(id)}/occupants`,
      occupants
    );
    return res.data;
  },

  // onboarding (single-commit flow)
  async startOnboarding(payload: StartTenancyRequest) {
    const res = await axiosClient.post<TenancyDto>(
      `${base}/onboarding`,
      payload
    );
    return res.data;
  },
};
