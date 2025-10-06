import { FilterRuleWire, QueryOptions } from "./shared";

export type PropertyDto = {
  id: string;
  code: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  bedrooms: number;
  bathrooms: number;
  furnished?: boolean;
  availableFrom?: string; // ISO
  landlordId: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
};

export type CreatePropertyRequest = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  bedrooms: number;
  bathrooms: number;
  furnished?: boolean;
  availableFrom?: string;
  landlordId: string;
  notes?: string;
};

export type UpdatePropertyRequest = Partial<CreatePropertyRequest>;

export const propertyKeys = {
  all: ["properties"] as const,
  list: (opts?: QueryOptions, filters?: FilterRuleWire[]) =>
    [...propertyKeys.all, "list", { opts, filters }] as const,
  detail: (id: string) => [...propertyKeys.all, "detail", id] as const,
};
