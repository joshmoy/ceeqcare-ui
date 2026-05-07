'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { useAuth } from '@/features/auth/auth-provider';
import { ApiError } from '@/lib/api-client';

import { createStaff, deleteStaff, listStaff } from './operations-api';
import { optionalNumber, optionalString } from './form-utils';
import {
  EmptyState,
  Field,
  formatEnum,
  Panel,
  ResourceLayout,
  SelectField,
} from './resource-layout';
import { CreateStaffInput } from './types';

const staffRoles = [
  'CARE_WORKER',
  'SENIOR_CARE_WORKER',
  'REGISTERED_MANAGER',
  'OPERATIONS_MANAGER',
  'QUALITY_COMPLIANCE_LEAD',
  'OTHER',
];
const trainingStatuses = ['COMPLIANT', 'DUE_SOON', 'EXPIRED', 'UNKNOWN'];

export function StaffPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const accessToken = auth.accessToken ?? '';
  const queryKey = ['staff', accessToken];

  const staffQuery = useQuery({
    queryKey,
    queryFn: () => listStaff(accessToken, { limit: 50 }),
    enabled: Boolean(accessToken),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateStaffInput) => createStaff(accessToken, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStaff(accessToken, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await createMutation.mutateAsync({
        name: String(formData.get('name') ?? ''),
        role: optionalString(formData.get('role')) as CreateStaffInput['role'],
        email: optionalString(formData.get('email')),
        phone: optionalString(formData.get('phone')),
        trainingStatus: optionalString(
          formData.get('trainingStatus'),
        ) as CreateStaffInput['trainingStatus'],
        weeklyHours: optionalNumber(formData.get('weeklyHours')),
        fatigueScore: optionalNumber(formData.get('fatigueScore')),
      });
      form.reset();
    } catch (caughtError: unknown) {
      setError(getErrorMessage(caughtError));
    }
  }

  return (
    <ResourceLayout
      description="Create and review care worker records scoped to the signed-in agency."
      title="Staff"
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Panel>
          <h3 className="text-lg font-semibold text-slate-950">Add staff</h3>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            <Field label="Name" name="name" required />
            <SelectField label="Role" name="role" options={staffRoles} />
            <Field label="Email" name="email" type="email" />
            <Field label="Phone" name="phone" />
            <SelectField
              label="Training status"
              name="trainingStatus"
              options={trainingStatuses}
            />
            <Field label="Weekly hours" name="weeklyHours" type="number" />
            <Field label="Fatigue score" name="fatigueScore" type="number" />
            {error ? <ErrorMessage message={error} /> : null}
            <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Add staff
            </button>
          </form>
        </Panel>

        <Panel>
          <h3 className="text-lg font-semibold text-slate-950">Staff records</h3>
          <div className="mt-5 grid gap-3">
            {staffQuery.data?.items.length ? (
              staffQuery.data.items.map((staff) => (
                <article
                  className="rounded-xl border border-slate-200 p-4"
                  key={staff.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-950">
                        {staff.name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatEnum(staff.role)} ·{' '}
                        {formatEnum(staff.trainingStatus)} · Fatigue{' '}
                        {staff.fatigueScore}
                      </p>
                      {staff.email ? (
                        <p className="mt-1 text-sm text-slate-500">
                          {staff.email}
                        </p>
                      ) : null}
                    </div>
                    <button
                      className="text-sm font-semibold text-red-600"
                      onClick={() => void deleteMutation.mutate(staff.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState label="No staff records yet." />
            )}
          </div>
        </Panel>
      </div>
    </ResourceLayout>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : 'Request failed.';
}
