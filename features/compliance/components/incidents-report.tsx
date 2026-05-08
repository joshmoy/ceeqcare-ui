import { EmptyState, Panel, formatEnum } from '@/features/operations/resource-layout';

import { ComplianceIncidents } from '../types';

export function IncidentsReport({ report }: { report: ComplianceIncidents }) {
  return (
    <Panel>
      <h3 className="text-lg font-semibold text-slate-950">Incident register</h3>
      <div className="mt-5 grid gap-3">
        {report.incidents.length ? (
          report.incidents.slice(0, 8).map((incident) => (
            <article className="rounded-xl border border-slate-200 p-4" key={incident.id}>
              <h4 className="font-semibold text-slate-950">
                {formatEnum(incident.type)} · {formatEnum(incident.severity)}
              </h4>
              <p className="mt-1 text-sm text-slate-600">
                {new Date(incident.occurredAt).toLocaleString()} ·{' '}
                {incident.client?.name ?? 'No client'} ·{' '}
                {incident.staff?.name ?? 'No staff'}
              </p>
              <p className="mt-3 text-sm text-slate-700">{incident.description}</p>
            </article>
          ))
        ) : (
          <EmptyState label="No incidents in this report period." />
        )}
      </div>
    </Panel>
  );
}
