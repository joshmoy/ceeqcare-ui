export type ComplianceMetadata = {
  generatedAt: string;
  generatedByUserId: string;
  agencyId: string;
  agencyName: string;
  dateRange: {
    from: string;
    to: string;
  };
};

export type ComplianceSummary = {
  metadata: ComplianceMetadata;
  agency: {
    id: string;
    name: string;
    cqcId: string | null;
  };
  operationalKpis: Record<string, number>;
  incidentKpis: Record<string, number>;
  staffKpis: Record<string, number>;
  risk: {
    score: number;
    riskLevel: string;
    generatedAt: string;
  } | null;
};

export type ComplianceIncidents = {
  metadata: ComplianceMetadata;
  totals: Record<string, number>;
  byType: Array<{ type: string; count: number }>;
  bySeverity: Array<{ severity: string; count: number }>;
  incidents: Array<{
    id: string;
    type: string;
    severity: string;
    description: string;
    occurredAt: string;
    resolvedAt?: string | null;
    staff?: { id: string; name: string } | null;
    client?: { id: string; name: string; reference?: string | null } | null;
  }>;
};

export type ComplianceStaff = {
  metadata: ComplianceMetadata;
  totals: Record<string, number>;
  trainingBreakdown: Array<{ trainingStatus: string; count: number }>;
  staff: Array<{
    id: string;
    name: string;
    role: string;
    email?: string | null;
    trainingStatus: string;
    weeklyHours?: string | number | null;
    fatigueScore: number;
    visitsInPeriod: number;
    hasTrainingGap: boolean;
  }>;
};

export type ComplianceReportType = 'summary' | 'incidents' | 'staff';
