export function formatPrice(
  amount: number,
  options?: { currency?: string; locale?: string }
) {
  const { currency = "USD", locale = "en-US" } = options ?? {};

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
