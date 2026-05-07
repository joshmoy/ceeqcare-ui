'use client';

import { ProtectedRoute } from '@/features/auth/protected-route';
import { useAuth } from '@/features/auth/auth-provider';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const auth = useAuth();

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              CareSight AI
            </p>
            <h1 className="text-xl font-semibold text-slate-950">
              Operations Dashboard
            </h1>
          </div>
          <button
            onClick={auth.logout}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            type="button"
          >
            Sign out
          </button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <p className="text-sm font-medium text-slate-500">Signed in as</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            {auth.user?.name}
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label="Email" value={auth.user?.email ?? ''} />
            <Info label="Role" value={formatRole(auth.user?.role ?? '')} />
            <Info label="Agency ID" value={auth.user?.agencyId ?? ''} />
            <Info label="User ID" value={auth.user?.id ?? ''} />
          </dl>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <p className="text-sm font-semibold text-blue-700">Auth scaffold</p>
          <h2 className="mt-3 text-xl font-semibold text-slate-950">
            Connected to backend auth
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            This page is protected by the frontend session provider and calls
            `GET /auth/me` using the stored JWT bearer token.
          </p>
        </article>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 break-all text-sm text-slate-900">{value}</dd>
    </div>
  );
}

function formatRole(role: string) {
  return role
    .split('_')
    .filter(Boolean)
    .map((part) => part[0] + part.slice(1).toLowerCase())
    .join(' ');
}
