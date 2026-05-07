import { apiBaseUrl } from '@/lib/config';

import {
  AuthResponse,
  AuthUser,
  LoginInput,
  RegisterAgencyInput,
} from './types';

type ApiErrorPayload = {
  message?: string | string[];
  error?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init.accessToken
        ? { authorization: `Bearer ${init.accessToken}` }
        : undefined),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    const message = Array.isArray(payload.message)
      ? payload.message.join(', ')
      : payload.message ?? payload.error ?? 'Request failed';

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export function registerAgency(
  input: RegisterAgencyInput,
): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register-agency', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getMe(accessToken: string): Promise<AuthUser> {
  return request<AuthUser>('/auth/me', {
    method: 'GET',
    accessToken,
  });
}
