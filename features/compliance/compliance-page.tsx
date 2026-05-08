'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/auth-provider';
import { ResourceLayout } from '@/features/operations/resource-layout';

import { getComplianceReport } from './compliance-api';
import { IncidentsReport } from './components/incidents-report';
import { CsvDownloadButton } from './components/report-actions';
import { ReportCard } from './components/report-card';
import { StaffReport } from './components/staff-report';

export function CompliancePage() {
  const auth = useAuth();
  const accessToken = auth.accessToken ?? '';

  const summaryQuery = useQuery({
    queryKey: ['compliance-summary', accessToken],
    queryFn: () => getComplianceReport(accessToken, 'summary'),
    enabled: Boolean(accessToken),
  });
  const incidentsQuery = useQuery({
    queryKey: ['compliance-incidents', accessToken],
    queryFn: () => getComplianceReport(accessToken, 'incidents'),
    enabled: Boolean(accessToken),
  });
  const staffQuery = useQuery({
    queryKey: ['compliance-staff', accessToken],
    queryFn: () => getComplianceReport(accessToken, 'staff'),
    enabled: Boolean(accessToken),
  });

  return (
    <ResourceLayout
      description="Generate CQC-ready operational, incident, and staff compliance reports from agency-scoped data."
      title="Compliance Reports"
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <CsvDownloadButton accessToken={accessToken} type="summary" />
        <CsvDownloadButton accessToken={accessToken} type="incidents" />
        <CsvDownloadButton accessToken={accessToken} type="staff" />
      </div>

      <div className="grid gap-6">
        {summaryQuery.data ? (
          <>
            <ReportCard
              metrics={{
                agency: summaryQuery.data.agency.name,
                cqcId: summaryQuery.data.agency.cqcId,
                generatedAt: new Date(
                  summaryQuery.data.metadata.generatedAt,
                ).toLocaleString(),
              }}
              title="Report metadata"
            />
            <div className="grid gap-6 lg:grid-cols-3">
              <ReportCard
                metrics={summaryQuery.data.operationalKpis}
                title="Operational KPIs"
              />
              <ReportCard
                metrics={summaryQuery.data.incidentKpis}
                title="Incident KPIs"
              />
              <ReportCard
                metrics={summaryQuery.data.staffKpis}
                title="Staff KPIs"
              />
            </div>
          </>
        ) : (
          <LoadingPanel label="Loading compliance summary..." />
        )}

        {incidentsQuery.data ? (
          <IncidentsReport report={incidentsQuery.data} />
        ) : (
          <LoadingPanel label="Loading incident report..." />
        )}

        {staffQuery.data ? (
          <StaffReport report={staffQuery.data} />
        ) : (
          <LoadingPanel label="Loading staff report..." />
        )}
      </div>
    </ResourceLayout>
  );
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      {label}
    </div>
  );
}
