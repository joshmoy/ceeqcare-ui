'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { useAuth } from '@/features/auth/auth-provider';
import { ApiError } from '@/lib/api-client';

import {
  isoFromLocalDateTime,
  optionalNumber,
  optionalString,
} from './form-utils';
import { createVisit, deleteVisit, listClients, listStaff, listVisits } from './operations-api';
import {
  EmptyState,
  Field,
  formatEnum,
  Panel,
  ResourceLayout,
  SelectField,
} from './resource-layout';
import { CreateVisitInput } from './types';

const visitStatuses = ['SCHEDULED', 'COMPLETED', 'LATE', 'MISSED', 'CANCELLED'];

export function VisitsPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const accessToken = auth.accessToken ?? '';
  const visitsKey = ['visits', accessToken];

  const visitsQuery = useQuery({
    queryKey: visitsKey,
    queryFn: () => listVisits(accessToken, { limit: 50 }),
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
    mutationFn: (input: CreateVisitInput) => createVisit(accessToken, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: visitsKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVisit(accessToken, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: visitsKey });
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const scheduledStart = isoFromLocalDateTime(formData.get('scheduledStart'));

    if (!scheduledStart) {
      setError('Scheduled start is required.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        staffId: String(formData.get('staffId') ?? ''),
        clientId: String(formData.get('clientId') ?? ''),
        scheduledStart,
        scheduledEnd: isoFromLocalDateTime(formData.get('scheduledEnd')),
        actualStart: isoFromLocalDateTime(formData.get('actualStart')),
        actualEnd: isoFromLocalDateTime(formData.get('actualEnd')),
        status: optionalString(formData.get('status')) as CreateVisitInput['status'],
        travelDuration: optionalNumber(formData.get('travelDuration')),
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
      description="Schedule and monitor visits, including late, missed, completed, and cancelled calls."
      title="Visits"
    >
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Panel>
          <h3 className="text-lg font-semibold text-slate-950">Add visit</h3>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
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
            <Field
              label="Scheduled start"
              name="scheduledStart"
              required
              type="datetime-local"
            />
            <Field label="Scheduled end" name="scheduledEnd" type="datetime-local" />
            <Field label="Actual start" name="actualStart" type="datetime-local" />
            <Field label="Actual end" name="actualEnd" type="datetime-local" />
            <SelectField label="Status" name="status" options={visitStatuses} />
            <Field label="Travel duration (minutes)" name="travelDuration" type="number" />
            {error ? <ErrorMessage message={error} /> : null}
            <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Add visit
            </button>
          </form>
        </Panel>

        <Panel>
          <h3 className="text-lg font-semibold text-slate-950">Visit records</h3>
          <div className="mt-5 grid gap-3">
            {visitsQuery.data?.items.length ? (
              visitsQuery.data.items.map((visit) => (
                <article
                  className="rounded-xl border border-slate-200 p-4"
                  key={visit.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-950">
                        {visit.client?.name ?? visit.clientId}
                      </h4>
                      <p className="mt-1 text-sm text-slate-600">
                        {visit.staff?.name ?? visit.staffId} ·{' '}
                        {formatEnum(visit.status)} ·{' '}
                        {new Date(visit.scheduledStart).toLocaleString()}
                      </p>
                    </div>
                    <button
                      className="text-sm font-semibold text-red-600"
                      onClick={() => void deleteMutation.mutate(visit.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState label="No visit records yet." />
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
        required
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
