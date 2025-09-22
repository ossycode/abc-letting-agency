import { LandlordDto } from "@/api/sdk";

export type LandlordQuery = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
  search?: string;
  searchFields?: string[];
  filters?: Array<{ field: string; op: string; value: string }>;
};

export type LandlordPaged = {
  items: LandlordDto[];
  page: number;
  pageSize: number;
  total: number;
};

export type Landlord = {
  id: string;
  name: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  bankIban?: string | null;
  bankSort?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  // add any extras your DTO returns (stats, counts, etc)
};
