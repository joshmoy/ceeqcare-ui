import { apiRequest } from '@/lib/api-client';
import { ListParams, withQuery } from '@/features/operations/operations-api';

import { RecalculateRiskInput, RiskDashboard, RiskScoreList } from './types';

export function getRiskDashboard(accessToken: string) {
  return apiRequest<RiskDashboard>('/risk/dashboard', { accessToken });
}

export function listRiskScores(accessToken: string, params?: ListParams) {
  return apiRequest<RiskScoreList>(withQuery('/risk/scores', params), {
    accessToken,
  });
}

export function recalculateRisk(
  accessToken: string,
  input: RecalculateRiskInput = {},
) {
  return apiRequest('/risk/recalculate', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(input),
  });
}
