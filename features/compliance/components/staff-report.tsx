import { EmptyState, Panel, formatEnum } from '@/features/operations/resource-layout';

import { ComplianceStaff } from '../types';

export function StaffReport({ report }: { report: ComplianceStaff }) {
  return (
    <Panel>
      <h3 className="text-lg font-semibold text-slate-950">Staff compliance</h3>
      <div className="mt-5 grid gap-3">
        {report.staff.length ? (
          report.staff.slice(0, 8).map((staff) => (
            <article className="rounded-xl border border-slate-200 p-4" key={staff.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-950">{staff.name}</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatEnum(staff.role)} · {formatEnum(staff.trainingStatus)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    staff.hasTrainingGap
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {staff.hasTrainingGap ? 'Gap' : 'Compliant'}
                </span>
              </div>
            </article>
          ))
        ) : (
          <EmptyState label="No staff records available." />
        )}
      </div>
    </Panel>
  );
}
