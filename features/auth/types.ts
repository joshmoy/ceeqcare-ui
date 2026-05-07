export type UserRole =
  | 'ADMIN'
  | 'REGISTERED_MANAGER'
  | 'OPERATIONS_MANAGER'
  | 'STAFF_VIEWER';

export type AuthUser = {
  id: string;
  agencyId: string;
  email: string;
  name: string;
  role: UserRole;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type RegisterAgencyInput = {
  agencyName: string;
  cqcId?: string;
  managerName: string;
  managerEmail: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
  agencyId?: string;
};
