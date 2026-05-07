'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { ApiError } from './auth-api';
import { useAuth } from './auth-provider';

type Mode = 'login' | 'register';

export function AuthShell({ mode }: { mode: Mode }) {
  const router = useRouter();
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      if (mode === 'login') {
        await auth.login({
          email: String(formData.get('email') ?? ''),
          password: String(formData.get('password') ?? ''),
          agencyId: optionalString(formData.get('agencyId')),
        });
      } else {
        await auth.registerAgency({
          agencyName: String(formData.get('agencyName') ?? ''),
          cqcId: optionalString(formData.get('cqcId')),
          managerName: String(formData.get('managerName') ?? ''),
          managerEmail: String(formData.get('managerEmail') ?? ''),
          password: String(formData.get('password') ?? ''),
        });
      }

      router.push('/dashboard');
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.message
          : 'Authentication failed. Please try again.',
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_420px]">
        <div className="flex flex-col justify-center rounded-3xl bg-slate-950 p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            CareSight AI
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            Operational risk intelligence for home care providers.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Sign in to monitor agency risk, compliance readiness, and workforce
            safety from one secure dashboard.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <span>JWT authentication</span>
            <span>Agency-scoped access</span>
            <span>Role-based permissions</span>
            <span>Audit-ready actions</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-slate-950">
            {mode === 'login' ? 'Sign in' : 'Register pilot agency'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {mode === 'login'
              ? 'Use your agency account credentials.'
              : 'Create the first registered manager account for an agency.'}
          </p>

          {mode === 'register' ? (
            <>
              <Field label="Agency name" name="agencyName" required />
              <Field label="CQC ID" name="cqcId" />
              <Field label="Manager name" name="managerName" required />
              <Field
                label="Manager email"
                name="managerEmail"
                required
                type="email"
              />
            </>
          ) : (
            <>
              <Field label="Email" name="email" required type="email" />
              <Field
                label="Agency ID"
                name="agencyId"
                helper="Only needed if your email belongs to multiple agencies."
              />
            </>
          )}

          <Field
            label="Password"
            name="password"
            required
            type="password"
            helper="Minimum 10 characters."
          />

          {error ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={auth.isLoading}
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {auth.isLoading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create agency'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            {mode === 'login' ? (
              <>
                Need to onboard a pilot agency?{' '}
                <Link className="font-semibold text-blue-700" href="/register">
                  Register here
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link className="font-semibold text-blue-700" href="/login">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  helper,
  required = false,
  type = 'text',
}: {
  label: string;
  name: string;
  helper?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="mt-5 block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        name={name}
        required={required}
        type={type}
      />
      {helper ? <span className="mt-1 block text-xs text-slate-500">{helper}</span> : null}
    </label>
  );
}

function optionalString(value: FormDataEntryValue | null): string | undefined {
  const text = String(value ?? '').trim();
  return text.length > 0 ? text : undefined;
}
