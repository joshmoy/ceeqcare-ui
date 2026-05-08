const accessTokenKey = 'ceeqcare.accessToken';
const accessTokenChangedEvent = 'ceeqcare.accessTokenChanged';

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(accessTokenKey);
}

export function storeAccessToken(token: string): void {
  window.localStorage.setItem(accessTokenKey, token);
  window.dispatchEvent(new Event(accessTokenChangedEvent));
}

export function clearStoredAccessToken(): void {
  window.localStorage.removeItem(accessTokenKey);
  window.dispatchEvent(new Event(accessTokenChangedEvent));
}

export function subscribeToStoredAccessToken(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === accessTokenKey) {
      callback();
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(accessTokenChangedEvent, callback);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(accessTokenChangedEvent, callback);
  };
}
