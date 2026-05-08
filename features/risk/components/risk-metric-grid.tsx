export function RiskMetricGrid({
  metrics,
}: {
  metrics: Record<string, number>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(metrics).map(([label, value]) => (
        <article
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          key={label}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {humanize(label)}
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </article>
      ))}
    </div>
  );
}

function humanize(value: string) {
  return value
    .replaceAll(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
}
