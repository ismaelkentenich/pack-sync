export function formatDate(
  date: string | Date,
  locale = "pt-BR",
): string {
  const value =
    date instanceof Date ? date : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(value);
}
