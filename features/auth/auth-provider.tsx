'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { getMe, login, registerAgency } from './auth-api';
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  storeAccessToken,
} from './token-storage';
import { AuthUser, LoginInput, RegisterAgencyInput } from './types';

type AuthContextValue = {
  accessToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  registerAgency: (input: RegisterAgencyInput) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    getStoredAccessToken(),
  );

  const meQuery = useQuery({
    queryKey: ['auth', 'me', accessToken],
    queryFn: () => getMe(accessToken ?? ''),
    enabled: Boolean(accessToken),
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      storeAccessToken(response.accessToken);
      setAccessToken(response.accessToken);
      queryClient.setQueryData(['auth', 'me', response.accessToken], response.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerAgency,
    onSuccess: (response) => {
      storeAccessToken(response.accessToken);
      setAccessToken(response.accessToken);
      queryClient.setQueryData(['auth', 'me', response.accessToken], response.user);
    },
  });

  const logout = useCallback(() => {
    clearStoredAccessToken();
    setAccessToken(null);
    queryClient.removeQueries({ queryKey: ['auth'] });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      user: meQuery.data ?? null,
      isLoading:
        meQuery.isLoading ||
        loginMutation.isPending ||
        registerMutation.isPending,
      isAuthenticated: Boolean(accessToken && meQuery.data),
      login: async (input) => {
        await loginMutation.mutateAsync(input);
      },
      registerAgency: async (input) => {
        await registerMutation.mutateAsync(input);
      },
      logout,
    }),
    [
      accessToken,
      loginMutation,
      logout,
      meQuery.data,
      meQuery.isLoading,
      registerMutation,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
