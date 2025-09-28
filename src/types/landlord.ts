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

export type LandlordDto = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  propertyCount: number;
  tenancyCount: number;
  invoiceCount: number;
  createdAt: string; // ISO
  updatedAt?: string | null; // ISO
  address?: string | null;
  notes?: string | null;
  bankIban?: string;
  bankSort?: string;
};

export type CreateLandlordRequest = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  bankIban?: string;
  bankSort?: string;
};

export type UpdateLandlordRequest = Partial<CreateLandlordRequest>;
