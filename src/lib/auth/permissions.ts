export const PERMISSIONS = {
  Users: {
    Read: "Permissions.Users.Read",
    Create: "Permissions.Users.Create",
    Update: "Permissions.Users.Update",
    Delete: "Permissions.Users.Delete",
  },
  // ... others as needed
} as const;

export const ROLES = {
  Admin: "Admin",
  Basic: "Basic",
  Manager: "Manager",
} as const;
