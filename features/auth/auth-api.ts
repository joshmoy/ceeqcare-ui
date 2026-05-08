import { apiRequest } from '@/lib/api-client';

import {
  AuthResponse,
  AuthUser,
  ConfirmMfaInput,
  LoginInput,
  LoginResponse,
  MfaEnrollment,
  MfaRecoveryCodes,
  RegisterAgencyInput,
  VerifyMfaLoginInput,
} from './types';

export function registerAgency(
  input: RegisterAgencyInput,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register-agency', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function verifyMfaLogin(
  input: VerifyMfaLoginInput,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/mfa/verify-login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getMe(accessToken: string): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/me', {
    method: 'GET',
    accessToken,
  });
}

export function startMfaEnrollment(
  accessToken: string,
): Promise<MfaEnrollment> {
  return apiRequest<MfaEnrollment>('/auth/mfa/enroll', {
    method: 'POST',
    accessToken,
  });
}

export function confirmMfaEnrollment(
  accessToken: string,
  input: ConfirmMfaInput,
): Promise<MfaRecoveryCodes> {
  return apiRequest<MfaRecoveryCodes>('/auth/mfa/confirm', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(input),
  });
}

export function regenerateMfaRecoveryCodes(
  accessToken: string,
): Promise<MfaRecoveryCodes> {
  return apiRequest<MfaRecoveryCodes>('/auth/mfa/recovery-codes', {
    method: 'POST',
    accessToken,
  });
}
