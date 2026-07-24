export function formatPrice(
  amount: number,
  options?: { currency?: string; locale?: string }
) {
  const { currency = "INR", locale = "en-IN" } = options ?? {};

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format price stored in paise (1 INR = 100 paise). */
export function formatPaise(paise: number) {
  return formatPrice(paise / 100);
}
