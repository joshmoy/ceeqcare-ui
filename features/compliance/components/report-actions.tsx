'use client';

import { useMutation } from '@tanstack/react-query';

import { ApiError } from '@/lib/api-client';

import { getComplianceCsv } from '../compliance-api';
import { ComplianceReportType } from '../types';

export function CsvDownloadButton({
  accessToken,
  type,
}: {
  accessToken: string;
  type: ComplianceReportType;
}) {
  const mutation = useMutation({
    mutationFn: () => getComplianceCsv(accessToken, type),
    onSuccess: (csv) => {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compliance-${type}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },
  });

  return (
    <div>
      <button
        className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
        type="button"
      >
        {mutation.isPending ? 'Preparing CSV...' : `Download ${type} CSV`}
      </button>
      {mutation.error ? (
        <p className="mt-2 text-sm text-red-700">
          {mutation.error instanceof ApiError
            ? mutation.error.message
            : 'CSV export failed.'}
        </p>
      ) : null}
    </div>
  );
}
