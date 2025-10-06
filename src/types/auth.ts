export type RegisterRequest = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: string;
  email: string;
  displayName: string;
  isPlatform: boolean;
  selectedAgencyId: number | null;
  agencyCount: number;
  needsAgencySelection: boolean;
  agencies: Array<{ id: number; name: string; slug: string }>;
  roles: string[];
  permissions: string[];
};
