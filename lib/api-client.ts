import { apiBaseUrl } from '@/lib/config';

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

export async function apiRequest<T>(
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

export async function apiTextRequest(
  path: string,
  init: RequestInit & { accessToken?: string } = {},
): Promise<string> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
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

  return response.text();
}
