import { Panel, formatEnum } from '@/features/operations/resource-layout';

export function ReportCard({
  title,
  metrics,
}: {
  title: string;
  metrics: Record<string, number | string | null | undefined>;
}) {
  return (
    <Panel>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {Object.entries(metrics).map(([label, value]) => (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" key={label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {formatLabel(label)}
            </dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-950">
              {value ?? 'N/A'}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

function formatLabel(label: string) {
  return formatEnum(label.replaceAll(/([A-Z])/g, '_$1').toUpperCase());
}
