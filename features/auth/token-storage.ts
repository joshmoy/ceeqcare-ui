const accessTokenKey = 'ceeqcare.accessToken';

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(accessTokenKey);
}

export function storeAccessToken(token: string): void {
  window.localStorage.setItem(accessTokenKey, token);
}

export function clearStoredAccessToken(): void {
  window.localStorage.removeItem(accessTokenKey);
}
