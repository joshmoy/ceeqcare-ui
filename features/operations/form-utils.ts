export function optionalString(value: FormDataEntryValue | null): string | undefined {
  const text = String(value ?? '').trim();
  return text.length > 0 ? text : undefined;
}

export function optionalNumber(value: FormDataEntryValue | null): number | undefined {
  const text = String(value ?? '').trim();
  if (!text) {
    return undefined;
  }

  const number = Number(text);
  return Number.isFinite(number) ? number : undefined;
}

export function isoFromLocalDateTime(
  value: FormDataEntryValue | null,
): string | undefined {
  const text = String(value ?? '').trim();
  if (!text) {
    return undefined;
  }

  return new Date(text).toISOString();
}
