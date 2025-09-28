import { FilterRuleWire, QueryOptions } from "./shared";

export type PropertyDto = {
  id: string;
  code?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city?: string | null;
  postcode?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  furnished?: boolean | null;
  availableFrom?: string | null; // ISO
  landlordId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePropertyRequest = {
  addressLine1: string;
  addressLine2?: string | null;
  city?: string | null;
  postcode?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  furnished?: boolean | null;
  availableFrom?: string | null;
  landlordId: string;
};

export type UpdatePropertyRequest = Partial<CreatePropertyRequest>;

export const propertyKeys = {
  all: ["properties"] as const,
  list: (opts?: QueryOptions, filters?: FilterRuleWire[]) =>
    [...propertyKeys.all, "list", { opts, filters }] as const,
  detail: (id: string) => [...propertyKeys.all, "detail", id] as const,
};
