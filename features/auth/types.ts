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
  mfaEnabled: boolean;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type MfaChallengeResponse = {
  type: 'MFA_REQUIRED';
  challengeToken: string;
  userId: string;
  agencyId: string;
  email: string;
};

export type LoginResponse = AuthResponse | MfaChallengeResponse;

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

export type VerifyMfaLoginInput = {
  challengeToken: string;
  code: string;
};

export type MfaEnrollment = {
  secret: string;
  otpAuthUrl: string;
};

export type ConfirmMfaInput = {
  code: string;
};

export type MfaRecoveryCodes = {
  recoveryCodes: string[];
};
