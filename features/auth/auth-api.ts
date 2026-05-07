import { apiRequest } from '@/lib/api-client';

import {
  AuthResponse,
  AuthUser,
  LoginInput,
  RegisterAgencyInput,
} from './types';

export function registerAgency(
  input: RegisterAgencyInput,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register-agency', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
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
