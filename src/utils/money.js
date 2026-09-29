// Formats backend "minor unit" money values, e.g. formatMoneyMinor(4900,
// "USD") -> "$49.00". The backend computes every amount (revenue,
// commission) — this only formats what it returns, never recalculates one
// from a percentage. See docs/backend-api-requirements.md #16.
export function formatMoneyMinor(amountMinor, currency = "USD") {
  if (amountMinor === null || amountMinor === undefined) return "—";

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amountMinor / 100);
  } catch {
    // Unrecognized currency code — fall back rather than throw.
    return `${(amountMinor / 100).toFixed(2)} ${currency}`;
  }
}
