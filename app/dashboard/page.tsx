'use client';

import { ProtectedRoute } from '@/features/auth/protected-route';
import { useAuth } from '@/features/auth/auth-provider';
import { AppNav } from '@/features/operations/app-nav';

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
      <AppNav />

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
          <p className="text-sm font-semibold text-blue-700">
            Intelligence endpoints
          </p>
          <h2 className="mt-3 text-xl font-semibold text-slate-950">
            Operational APIs connected
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Use the navigation above to manage operational records, review risk
            scoring, and export compliance reports using the backend JWT and
            agency-scoped APIs.
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
