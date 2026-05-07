'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { useAuth } from '@/features/auth/auth-provider';
import { ApiError } from '@/lib/api-client';

import { isoFromLocalDateTime, optionalString } from './form-utils';
import {
  createIncident,
  listClients,
  listIncidents,
  listStaff,
} from './operations-api';
import {
  EmptyState,
  Field,
  formatEnum,
  Panel,
  ResourceLayout,
  SelectField,
} from './resource-layout';
import { CreateIncidentInput } from './types';

const incidentTypes = [
  'SAFEGUARDING',
  'MEDICATION_ERROR',
  'COMPLAINT',
  'MISSED_CALL',
  'OTHER',
];
const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export function IncidentsPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const accessToken = auth.accessToken ?? '';
  const incidentsKey = ['incidents', accessToken];

  const incidentsQuery = useQuery({
    queryKey: incidentsKey,
    queryFn: () => listIncidents(accessToken, { limit: 50 }),
    enabled: Boolean(accessToken),
  });
  const staffQuery = useQuery({
    queryKey: ['staff-options', accessToken],
    queryFn: () => listStaff(accessToken, { limit: 100 }),
    enabled: Boolean(accessToken),
  });
  const clientsQuery = useQuery({
    queryKey: ['client-options', accessToken],
    queryFn: () => listClients(accessToken, { limit: 100, isActive: true }),
    enabled: Boolean(accessToken),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateIncidentInput) =>
      createIncident(accessToken, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: incidentsKey });
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const occurredAt = isoFromLocalDateTime(formData.get('occurredAt'));

    if (!occurredAt) {
      setError('Occurred at is required.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        staffId: optionalString(formData.get('staffId')),
        clientId: optionalString(formData.get('clientId')),
        type: String(formData.get('type') ?? '') as CreateIncidentInput['type'],
        severity: String(
          formData.get('severity') ?? '',
        ) as CreateIncidentInput['severity'],
        description: String(formData.get('description') ?? ''),
        occurredAt,
        resolvedAt: isoFromLocalDateTime(formData.get('resolvedAt')),
      });
      form.reset();
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof ApiError ? caughtError.message : 'Request failed.',
      );
    }
  }

  return (
    <ResourceLayout
      description="Capture safeguarding, medication, complaint, and missed-call events for compliance review."
      title="Incidents"
    >
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Panel>
          <h3 className="text-lg font-semibold text-slate-950">Add incident</h3>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            <SelectField label="Type" name="type" options={incidentTypes} required />
            <SelectField
              label="Severity"
              name="severity"
              options={severities}
              required
            />
            <SelectFromItems
              items={staffQuery.data?.items.map((staff) => ({
                label: staff.name,
                value: staff.id,
              }))}
              label="Staff member"
              name="staffId"
            />
            <SelectFromItems
              items={clientsQuery.data?.items.map((client) => ({
                label: client.name,
                value: client.id,
              }))}
              label="Client"
              name="clientId"
            />
            <Field label="Occurred at" name="occurredAt" required type="datetime-local" />
            <Field label="Resolved at" name="resolvedAt" type="datetime-local" />
            <label className="block">
              <span className="text-sm font-medium text-slate-800">
                Description
              </span>
              <textarea
                className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                name="description"
                required
              />
            </label>
            {error ? <ErrorMessage message={error} /> : null}
            <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Add incident
            </button>
          </form>
        </Panel>

        <Panel>
          <h3 className="text-lg font-semibold text-slate-950">
            Incident records
          </h3>
          <div className="mt-5 grid gap-3">
            {incidentsQuery.data?.items.length ? (
              incidentsQuery.data.items.map((incident) => (
                <article
                  className="rounded-xl border border-slate-200 p-4"
                  key={incident.id}
                >
                  <h4 className="font-semibold text-slate-950">
                    {formatEnum(incident.type)} · {formatEnum(incident.severity)}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600">
                    {new Date(incident.occurredAt).toLocaleString()} ·{' '}
                    {incident.client?.name ?? 'No client'} ·{' '}
                    {incident.staff?.name ?? 'No staff'}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {incident.description}
                  </p>
                </article>
              ))
            ) : (
              <EmptyState label="No incident records yet." />
            )}
          </div>
        </Panel>
      </div>
    </ResourceLayout>
  );
}

function SelectFromItems({
  label,
  name,
  items = [],
}: {
  label: string;
  name: string;
  items?: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <select
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        name={name}
      >
        <option value="">Select...</option>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  );
}
