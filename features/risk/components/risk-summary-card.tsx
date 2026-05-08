import { RiskLevel } from '@/features/operations/types';
import { formatEnum } from '@/features/operations/resource-layout';

export function RiskSummaryCard({
  label,
  score,
  level,
}: {
  label: string;
  score: number;
  level: RiskLevel;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="text-5xl font-semibold tracking-tight text-slate-950">
          {score}
        </span>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${levelClass(level)}`}>
          {formatEnum(level)}
        </span>
      </div>
    </article>
  );
}

export function levelClass(level: RiskLevel) {
  switch (level) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-700';
    case 'HIGH':
      return 'bg-orange-100 text-orange-700';
    case 'MEDIUM':
      return 'bg-amber-100 text-amber-700';
    case 'LOW':
      return 'bg-emerald-100 text-emerald-700';
  }
}
