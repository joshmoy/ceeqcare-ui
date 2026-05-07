import { apiRequest } from '@/lib/api-client';

import {
  Client,
  CreateClientInput,
  CreateIncidentInput,
  CreateStaffInput,
  CreateVisitInput,
  Incident,
  PaginatedResponse,
  Staff,
  Visit,
} from './types';

type ListParams = Record<string, string | number | boolean | undefined>;

function withQuery(path: string, params: ListParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export function listStaff(accessToken: string, params?: ListParams) {
  return apiRequest<PaginatedResponse<Staff>>(withQuery('/staff', params), {
    accessToken,
  });
}

export function createStaff(accessToken: string, input: CreateStaffInput) {
  return apiRequest<Staff>('/staff', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(input),
  });
}

export function updateStaff(
  accessToken: string,
  id: string,
  input: Partial<CreateStaffInput>,
) {
  return apiRequest<Staff>(`/staff/${id}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(input),
  });
}

export function deleteStaff(accessToken: string, id: string) {
  return apiRequest<{ id: string; deleted: true }>(`/staff/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}

export function listClients(accessToken: string, params?: ListParams) {
  return apiRequest<PaginatedResponse<Client>>(withQuery('/clients', params), {
    accessToken,
  });
}

export function createClient(accessToken: string, input: CreateClientInput) {
  return apiRequest<Client>('/clients', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(input),
  });
}

export function updateClient(
  accessToken: string,
  id: string,
  input: Partial<CreateClientInput>,
) {
  return apiRequest<Client>(`/clients/${id}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(input),
  });
}

export function deleteClient(accessToken: string, id: string) {
  return apiRequest<{ id: string; deleted: true }>(`/clients/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}

export function listVisits(accessToken: string, params?: ListParams) {
  return apiRequest<PaginatedResponse<Visit>>(withQuery('/visits', params), {
    accessToken,
  });
}

export function createVisit(accessToken: string, input: CreateVisitInput) {
  return apiRequest<Visit>('/visits', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(input),
  });
}

export function updateVisit(
  accessToken: string,
  id: string,
  input: Partial<CreateVisitInput>,
) {
  return apiRequest<Visit>(`/visits/${id}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(input),
  });
}

export function deleteVisit(accessToken: string, id: string) {
  return apiRequest<{ id: string; deleted: true }>(`/visits/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}

export function listIncidents(accessToken: string, params?: ListParams) {
  return apiRequest<PaginatedResponse<Incident>>(
    withQuery('/incidents', params),
    {
      accessToken,
    },
  );
}

export function createIncident(
  accessToken: string,
  input: CreateIncidentInput,
) {
  return apiRequest<Incident>('/incidents', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(input),
  });
}

export function updateIncident(
  accessToken: string,
  id: string,
  input: Partial<CreateIncidentInput>,
) {
  return apiRequest<Incident>(`/incidents/${id}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(input),
  });
}
