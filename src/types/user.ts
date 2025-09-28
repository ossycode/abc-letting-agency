export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
};

export type UpdateMeRequest = Partial<Pick<User, "firstName" | "lastName">>;
export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
export type DeleteMeRequest = { reason?: string };
