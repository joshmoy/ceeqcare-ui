'use client';

import QRCode from 'qrcode';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';

import { ApiError } from '@/lib/api-client';

import { useAuth } from './auth-provider';
import { MfaEnrollment } from './types';

export function MfaSettings() {
  const auth = useAuth();
  const [enrollment, setEnrollment] = useState<MfaEnrollment | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );
  const [recoveryCodesCopyStatus, setRecoveryCodesCopyStatus] = useState<
    'idle' | 'copied' | 'failed'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  /** One-time regenerate offer only right after first MFA confirmation. */
  const [canRegenerateRecoveryCodesOnce, setCanRegenerateRecoveryCodesOnce] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!enrollment) {
      return () => {
        isMounted = false;
      };
    }

    QRCode.toDataURL(enrollment.otpAuthUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 220,
      color: {
        dark: '#020617',
        light: '#ffffff',
      },
    })
      .then((dataUrl) => {
        if (isMounted) {
          setQrCodeDataUrl(dataUrl);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('QR code generation failed. Use the setup key instead.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [enrollment]);

  async function startEnrollment() {
    setError(null);
    setCanRegenerateRecoveryCodesOnce(false);
    setRecoveryCodesCopyStatus('idle');
    setRecoveryCodes([]);
    setIsWorking(true);

    try {
      setQrCodeDataUrl(null);
      setCopyStatus('idle');
      const nextEnrollment = await auth.startMfaEnrollment();
      setEnrollment(nextEnrollment);
    } catch (caughtError: unknown) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsWorking(false);
    }
  }

  async function confirmEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsWorking(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await auth.confirmMfaEnrollment({
        code: String(formData.get('code') ?? ''),
      });
      setRecoveryCodesCopyStatus('idle');
      setRecoveryCodes(result.recoveryCodes);
      setCanRegenerateRecoveryCodesOnce(true);
      setQrCodeDataUrl(null);
      setEnrollment(null);
    } catch (caughtError: unknown) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsWorking(false);
    }
  }

  async function regenerateRecoveryCodes() {
    setError(null);
    setRecoveryCodesCopyStatus('idle');
    setRecoveryCodes([]);
    setIsWorking(true);

    try {
      const result = await auth.regenerateMfaRecoveryCodes();
      setRecoveryCodesCopyStatus('idle');
      setRecoveryCodes(result.recoveryCodes);
      setCanRegenerateRecoveryCodesOnce(false);
    } catch (caughtError: unknown) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsWorking(false);
    }
  }

  async function copySetupKey() {
    if (!enrollment) {
      return;
    }

    try {
      await navigator.clipboard.writeText(enrollment.secret);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }

  async function copyRecoveryCodes() {
    if (recoveryCodes.length === 0) {
      return;
    }

    try {
      await navigator.clipboard.writeText(recoveryCodes.join('\n'));
      setRecoveryCodesCopyStatus('copied');
    } catch {
      setRecoveryCodesCopyStatus('failed');
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Multi-factor auth</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {auth.user?.mfaEnabled ? 'MFA is enabled' : 'Protect this account'}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use an authenticator app for sign-in challenges. Recovery codes are
            shown once after setup; you can replace them once from this screen
            right after confirming MFA.
          </p>
        </div>
        {auth.user?.mfaEnabled ? null : (
          <button
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={isWorking}
            onClick={() => void startEnrollment()}
            type="button"
          >
            Set up MFA
          </button>
        )}
      </div>

      {enrollment ? (
        <form className="mt-6 grid gap-4" onSubmit={confirmEnrollment}>
          <div className="grid gap-4 md:grid-cols-[260px_1fr]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Scan QR code
              </p>
              <div className="mt-3 flex aspect-square w-full max-w-[220px] items-center justify-center rounded-xl border border-slate-200 bg-white p-3">
                {qrCodeDataUrl ? (
                  <Image
                    alt="Authenticator app setup QR code"
                    className="h-full w-full"
                    height={220}
                    src={qrCodeDataUrl}
                    width={220}
                    unoptimized
                  />
                ) : (
                  <span className="text-sm text-slate-500">Preparing QR...</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Setup key
                </p>
                <button
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
                  onClick={() => void copySetupKey()}
                  type="button"
                >
                  {copyStatus === 'copied' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="mt-2 break-all font-mono text-sm text-slate-950">
                {enrollment.secret}
              </p>
              {copyStatus === 'failed' ? (
                <p className="mt-2 text-xs text-red-700">
                  Copy failed. Select the key manually.
                </p>
              ) : null}
              <p className="mt-3 break-all text-xs text-slate-500">
                {enrollment.otpAuthUrl}
              </p>
            </div>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-slate-800">
              Verification code
            </span>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              name="code"
              required
            />
          </label>
          <button
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={isWorking}
            type="submit"
          >
            Confirm MFA
          </button>
        </form>
      ) : null}

      {recoveryCodes.length > 0 ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-amber-900">
              Recovery codes
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {canRegenerateRecoveryCodesOnce ? (
                <button
                  className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-950 hover:bg-amber-100 disabled:opacity-60"
                  disabled={isWorking}
                  onClick={() => void regenerateRecoveryCodes()}
                  type="button"
                >
                  Regenerate codes
                </button>
              ) : null}
              <button
                className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-950 hover:bg-amber-100"
                onClick={() => void copyRecoveryCodes()}
                type="button"
              >
                {recoveryCodesCopyStatus === 'copied'
                  ? 'Copied'
                  : 'Copy all codes'}
              </button>
            </div>
          </div>
          {recoveryCodesCopyStatus === 'failed' ? (
            <p className="mt-2 text-xs text-red-700">
              Copy failed. Select the codes manually.
            </p>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {recoveryCodes.map((code) => (
              <code
                className="rounded-lg bg-white px-3 py-2 text-sm text-slate-950"
                key={code}
              >
                {code}
              </code>
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </article>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : 'MFA request failed.';
}
