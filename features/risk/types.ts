import { Client, PaginatedResponse, RiskLevel, Staff } from '@/features/operations/types';

export type RiskEntityType = 'AGENCY' | 'STAFF' | 'CLIENT' | 'VISIT';

export type RiskScore = {
  id?: string;
  agencyId: string;
  entityType: RiskEntityType;
  entityId: string;
  score: number;
  riskLevel: RiskLevel;
  reasons?: unknown;
  generatedAt?: string;
};

export type RiskTrendPoint = {
  date: string;
  count: number;
};

export type HydratedStaffRisk = RiskScore & {
  staff: Pick<Staff, 'id' | 'name' | 'role' | 'fatigueScore'> | null;
};

export type HydratedClientRisk = RiskScore & {
  client: Pick<Client, 'id' | 'name' | 'reference'> | null;
};

export type RiskDashboard = {
  generatedAt: string;
  agencyRiskScore: RiskScore;
  metrics: {
    visitsLast30Days: number;
    lateVisitsLast30Days: number;
    missedVisitsLast30Days: number;
    incidentsLast30Days: number;
    highSeverityIncidentsLast30Days: number;
    staffTrainingGaps: number;
  };
  trends: {
    lateVisits: RiskTrendPoint[];
    missedVisits: RiskTrendPoint[];
  };
  highRiskStaff: HydratedStaffRisk[];
  highRiskClients: HydratedClientRisk[];
  recentAlerts: RiskScore[];
};

export type RiskScoreList = PaginatedResponse<RiskScore>;

export type RecalculateRiskInput = {
  entityType?: RiskEntityType;
  entityId?: string;
};
