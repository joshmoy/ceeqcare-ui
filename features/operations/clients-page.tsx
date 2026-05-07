'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { useAuth } from '@/features/auth/auth-provider';
import { ApiError } from '@/lib/api-client';

import { optionalString } from './form-utils';
import { createClient, deleteClient, listClients } from './operations-api';
import { EmptyState, Field, Panel, ResourceLayout } from './resource-layout';
import { CreateClientInput } from './types';

export function ClientsPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const accessToken = auth.accessToken ?? '';
  const queryKey = ['clients', accessToken];

  const clientsQuery = useQuery({
    queryKey,
    queryFn: () => listClients(accessToken, { limit: 50 }),
    enabled: Boolean(accessToken),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateClientInput) => createClient(accessToken, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClient(accessToken, id),
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
        reference: optionalString(formData.get('reference')),
        postcode: optionalString(formData.get('postcode')),
        isActive: true,
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
      description="Manage agency-scoped clients for visit records, incidents, and risk intelligence."
      title="Clients"
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Panel>
          <h3 className="text-lg font-semibold text-slate-950">Add client</h3>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            <Field label="Name" name="name" required />
            <Field label="Reference" name="reference" />
            <Field label="Postcode" name="postcode" />
            {error ? <ErrorMessage message={error} /> : null}
            <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Add client
            </button>
          </form>
        </Panel>

        <Panel>
          <h3 className="text-lg font-semibold text-slate-950">
            Client records
          </h3>
          <div className="mt-5 grid gap-3">
            {clientsQuery.data?.items.length ? (
              clientsQuery.data.items.map((client) => (
                <article
                  className="rounded-xl border border-slate-200 p-4"
                  key={client.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-950">
                        {client.name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-600">
                        {client.reference ?? 'No reference'} ·{' '}
                        {client.postcode ?? 'No postcode'}
                      </p>
                    </div>
                    <button
                      className="text-sm font-semibold text-red-600"
                      onClick={() => void deleteMutation.mutate(client.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState label="No client records yet." />
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
