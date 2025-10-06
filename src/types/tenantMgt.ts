export type Id = string;

export enum RentFrequency {
  Monthly = "Monthly",
  FourWeekly = "FourWeekly",
  Weekly = "Weekly",
  Yearly = "Yearly",
}

export enum TenantStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type CreateTenantRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  secondEmail?: string;
  secondPhone?: string;
  notes?: string;
};

export type TenancyDto = {
  id: Id;
  propertyId: Id;
  landlordId: Id;
  status: string; // "ACTIVE" etc
  startDate?: string | null;
  endDate?: string | null;
  rentDueDay: number;
  frequency: RentFrequency;
  rentAmount: number;
  commissionPercent?: number | null;
  depositAmount?: number | null;
  depositLocation?: string | null;
  nextChargeDate?: string | null;
  notes?: string | null;
  occupants?: OccupantDto[];
  createdAt: string;
  updatedAt: string;
};

export type TenantDto = {
  id: Id;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  secondEmail?: string | null;
  secondPhone?: string | null;
  status: string;
  notes?: string | null;
};

export type UpdateTenancyStatusRequest = {
  tenancyId: Id;
};

export type OccupantDto = {
  tenantId: Id;
  fullName: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  responsibilitySharePercent?: number | null;
  occupancyStart?: string | null;
  occupancyEnd?: string | null;
};

export type RentChargeDto = {
  id: Id;
  tenancyId: Id;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  amount: number;
  commissionDue?: number | null;
  amountAfterCommission?: number | null;
  status: "OPEN" | "PAID" | "PARTIAL";
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  paid?: number; // your controller augments these
  outstanding?: number; // your controller augments these
  isOverdue?: boolean; // your controller augments these
};

export type UpdateTenantRequest = CreateTenantRequest & {
  status: TenantStatus;
};

export type CreateOccupant = {
  tenantId: Id;
  isPrimary: boolean;
  responsibilitySharePercent?: number | null;
  occupancyStart?: string | null;
  occupancyEnd?: string | null;
};

export type CreateTenancyRequest = {
  propertyId: Id;
  landlordId: Id;
  status: "ACTIVE" | "DRAFT" | "ENDED"; // whatever you support
  startDate?: string | null; // ISO
  endDate?: string | null;
  rentDueDay: number; // 1-31
  frequency: RentFrequency;
  rentAmount: number;
  commissionPercent?: number | null;
  depositAmount?: number | null;
  depositLocation?: string | null;
  notes?: string | null;
  occupants: CreateOccupant[];
};

export type UpdateTenancyRequest = Omit<
  CreateTenancyRequest,
  "propertyId" | "landlordId" | "occupants"
>;

export type UpdateOccupant = {
  tenantId: Id;
  isPrimary: boolean;
  responsibilitySharePercent?: number | null;
  occupancyStart?: string | null;
  occupancyEnd?: string | null;
};

export type UpdateBillingScheduleRequest = {
  startDate?: string | null;
  rentDueDay: number;
  frequency: RentFrequency;
  effectiveFrom?: string | null;
  rebuildFutureCharges: boolean;
};

export type SetNextChargeDateRequest = {
  nextChargeDate: string | null;
};

export type RentChargeCreateModel = {
  tenancyId: Id;
  periodStart?: string; // if omitted, backend will derive from tenancy
  periodEnd?: string;
  dueDate?: string;
  amount?: number;
  notes?: string | null;
  advanceNextChargeDate?: boolean;
};

// Single-commit onboarding payload:
export type StartTenancyRequest = {
  propertyId: Id;
  landlordId: Id;
  startDate: string; // ISO
  endDate?: string | null;
  rentDueDay: number;
  frequency: RentFrequency;
  rentAmount: number;
  commissionPercent?: number | null;
  depositAmount?: number | null;
  depositLocation?: string | null;
  notes?: string | null;
  seedFirstCharge?: boolean;
  occupants: Array<{
    tenantId?: Id; // when selecting existing tenant
    newTenant?: CreateTenantRequest; // when creating new tenant inline
    isPrimary: boolean;
    responsibilitySharePercent?: number | null;
    occupancyStart?: string | null;
    occupancyEnd?: string | null;
  }>;
};
