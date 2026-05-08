'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';

import {
  confirmMfaEnrollment,
  getMe,
  login,
  registerAgency,
  regenerateMfaRecoveryCodes,
  startMfaEnrollment,
  verifyMfaLogin,
} from './auth-api';
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  subscribeToStoredAccessToken,
  storeAccessToken,
} from './token-storage';
import {
  AuthUser,
  ConfirmMfaInput,
  LoginInput,
  LoginResponse,
  MfaChallengeResponse,
  MfaEnrollment,
  MfaRecoveryCodes,
  RegisterAgencyInput,
  VerifyMfaLoginInput,
} from './types';

type AuthContextValue = {
  accessToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<LoginResponse>;
  verifyMfaLogin: (input: VerifyMfaLoginInput) => Promise<void>;
  registerAgency: (input: RegisterAgencyInput) => Promise<void>;
  startMfaEnrollment: () => Promise<MfaEnrollment>;
  confirmMfaEnrollment: (input: ConfirmMfaInput) => Promise<MfaRecoveryCodes>;
  regenerateMfaRecoveryCodes: () => Promise<MfaRecoveryCodes>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const accessToken = useSyncExternalStore(
    subscribeToStoredAccessToken,
    getStoredAccessToken,
    () => null,
  );

  const meQuery = useQuery({
    queryKey: ['auth', 'me', accessToken],
    queryFn: () => getMe(accessToken ?? ''),
    enabled: Boolean(accessToken),
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      if (isMfaChallengeResponse(response)) {
        return;
      }

      storeAccessToken(response.accessToken);
      queryClient.setQueryData(['auth', 'me', response.accessToken], response.user);
    },
  });

  const verifyMfaLoginMutation = useMutation({
    mutationFn: verifyMfaLogin,
    onSuccess: (response) => {
      storeAccessToken(response.accessToken);
      queryClient.setQueryData(['auth', 'me', response.accessToken], response.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerAgency,
    onSuccess: (response) => {
      storeAccessToken(response.accessToken);
      queryClient.setQueryData(['auth', 'me', response.accessToken], response.user);
    },
  });

  const logout = useCallback(() => {
    clearStoredAccessToken();
    queryClient.removeQueries({ queryKey: ['auth'] });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      user: meQuery.data ?? null,
      isLoading:
        meQuery.isLoading ||
        loginMutation.isPending ||
        verifyMfaLoginMutation.isPending ||
        registerMutation.isPending,
      isAuthenticated: Boolean(accessToken && meQuery.data),
      login: async (input) => {
        return loginMutation.mutateAsync(input);
      },
      verifyMfaLogin: async (input) => {
        await verifyMfaLoginMutation.mutateAsync(input);
      },
      registerAgency: async (input) => {
        await registerMutation.mutateAsync(input);
      },
      startMfaEnrollment: async () =>
        startMfaEnrollment(accessToken ?? ''),
      confirmMfaEnrollment: async (input) => {
        const result = await confirmMfaEnrollment(accessToken ?? '', input);
        await queryClient.invalidateQueries({ queryKey: ['auth'] });
        return result;
      },
      regenerateMfaRecoveryCodes: async () =>
        regenerateMfaRecoveryCodes(accessToken ?? ''),
      logout,
    }),
    [
      accessToken,
      loginMutation,
      logout,
      meQuery.data,
      meQuery.isLoading,
      queryClient,
      registerMutation,
      verifyMfaLoginMutation,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function isMfaChallengeResponse(
  response: LoginResponse,
): response is MfaChallengeResponse {
  return 'type' in response && response.type === 'MFA_REQUIRED';
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
