import { EmptyState, formatEnum, Panel } from '@/features/operations/resource-layout';

import { HydratedClientRisk, HydratedStaffRisk, RiskScore } from '../types';
import { levelClass } from './risk-summary-card';

export function HighRiskStaffList({ items }: { items: HydratedStaffRisk[] }) {
  return (
    <Panel>
      <h3 className="text-lg font-semibold text-slate-950">High-risk staff</h3>
      <div className="mt-5 grid gap-3">
        {items.length ? (
          items.map((item) => (
            <RiskRow
              key={`${item.entityId}-${item.generatedAt ?? item.score}`}
              label={item.staff?.name ?? item.entityId}
              meta={item.staff ? `${formatEnum(item.staff.role)} · Fatigue ${item.staff.fatigueScore}` : 'Unknown staff'}
              score={item}
            />
          ))
        ) : (
          <EmptyState label="No high-risk staff scores yet." />
        )}
      </div>
    </Panel>
  );
}

export function HighRiskClientList({ items }: { items: HydratedClientRisk[] }) {
  return (
    <Panel>
      <h3 className="text-lg font-semibold text-slate-950">High-risk clients</h3>
      <div className="mt-5 grid gap-3">
        {items.length ? (
          items.map((item) => (
            <RiskRow
              key={`${item.entityId}-${item.generatedAt ?? item.score}`}
              label={item.client?.name ?? item.entityId}
              meta={item.client?.reference ?? 'No reference'}
              score={item}
            />
          ))
        ) : (
          <EmptyState label="No high-risk client scores yet." />
        )}
      </div>
    </Panel>
  );
}

export function RecentRiskAlerts({ items }: { items: RiskScore[] }) {
  return (
    <Panel>
      <h3 className="text-lg font-semibold text-slate-950">Recent alerts</h3>
      <div className="mt-5 grid gap-3">
        {items.length ? (
          items.map((item) => (
            <RiskRow
              key={`${item.entityType}-${item.entityId}-${item.generatedAt ?? item.score}`}
              label={`${formatEnum(item.entityType)} risk`}
              meta={item.generatedAt ? new Date(item.generatedAt).toLocaleString() : item.entityId}
              score={item}
            />
          ))
        ) : (
          <EmptyState label="No high-risk alerts yet." />
        )}
      </div>
    </Panel>
  );
}

function RiskRow({
  label,
  meta,
  score,
}: {
  label: string;
  meta: string;
  score: Pick<RiskScore, 'riskLevel' | 'score'>;
}) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div>
        <h4 className="font-semibold text-slate-950">{label}</h4>
        <p className="mt-1 text-sm text-slate-600">{meta}</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-semibold text-slate-950">{score.score}</p>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${levelClass(score.riskLevel)}`}>
          {formatEnum(score.riskLevel)}
        </span>
      </div>
    </article>
  );
}
