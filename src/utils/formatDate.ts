export function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calcReadingTime(body: string): number {
  const japaneseChars = (body.match(/[　-鿿＀-￯]/g) ?? []).length;
  const englishWords = (body.match(/[a-zA-Z]+/g) ?? []).length;
  return Math.max(1, Math.ceil(japaneseChars / 500 + englishWords / 200));
}

export function formatPeriod(
  startDate: Date,
  endDate?: Date,
  locale: string = "ja-JP",
  presentText: string = "現在"
): string {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };
  const start = startDate.toLocaleDateString(locale, options);
  const end = endDate ? endDate.toLocaleDateString(locale, options) : presentText;
  return `${start} – ${end}`;
}

// Returns null when endDate is absent (caller shows "ongoing" state).
export function calculateDuration(
  startDate: Date,
  endDate: Date | undefined,
  monthsLabel: string = "ヶ月",
  yearsLabel: string = "年"
): string | null {
  if (!endDate) return null;
  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `(${months}${monthsLabel})`;
  if (months === 0) return `(${years}${yearsLabel})`;
  return `(${years}${yearsLabel}${months}${monthsLabel})`;
}
