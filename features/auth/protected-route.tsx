'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from './auth-provider';
import { UserRole } from './types';

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: UserRole[];
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace('/login');
    }
  }, [auth.isAuthenticated, auth.isLoading, router]);

  if (auth.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Loading your session...</p>
      </main>
    );
  }

  if (!auth.user) {
    return null;
  }

  if (roles && !roles.includes(auth.user.role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow">
          <h1 className="text-xl font-semibold text-slate-950">
            Access restricted
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Your role does not have access to this area.
          </p>
        </section>
      </main>
    );
  }

  return children;
}
