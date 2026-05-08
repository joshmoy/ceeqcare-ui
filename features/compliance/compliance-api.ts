import { apiRequest, apiTextRequest } from '@/lib/api-client';
import { ListParams, withQuery } from '@/features/operations/operations-api';

import {
  ComplianceIncidents,
  ComplianceReportType,
  ComplianceStaff,
  ComplianceSummary,
} from './types';

type ReportMap = {
  summary: ComplianceSummary;
  incidents: ComplianceIncidents;
  staff: ComplianceStaff;
};

export function getComplianceReport<T extends ComplianceReportType>(
  accessToken: string,
  type: T,
  params?: ListParams,
) {
  return apiRequest<ReportMap[T]>(withQuery(`/compliance/${type}`, params), {
    accessToken,
  });
}

export function getComplianceCsv(
  accessToken: string,
  type: ComplianceReportType,
  params?: ListParams,
) {
  return apiTextRequest(
    withQuery(`/compliance/${type}`, { ...params, format: 'csv' }),
    { accessToken },
  );
}
