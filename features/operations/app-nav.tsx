'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/features/auth/auth-provider';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/staff', label: 'Staff' },
  { href: '/clients', label: 'Clients' },
  { href: '/visits', label: 'Visits' },
  { href: '/incidents', label: 'Incidents' },
];

export function AppNav() {
  const pathname = usePathname();
  const auth = useAuth();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            CareSight AI
          </p>
          <h1 className="text-xl font-semibold text-slate-950">
            Operations Intelligence
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <Link
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <button
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            onClick={auth.logout}
            type="button"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
