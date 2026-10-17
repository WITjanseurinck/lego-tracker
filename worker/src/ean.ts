export function normalizeEan(ean?: string): string | undefined {
  if (!ean) return undefined;
  const digits = ean.replace(/\D/g, '');
  return digits.length === 13 ? digits : digits.length === 12 ? `0${digits}` : undefined;
}
