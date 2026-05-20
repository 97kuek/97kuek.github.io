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

export function formatPeriod(startDate: Date, endDate?: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };
  const start = startDate.toLocaleDateString("ja-JP", options);
  const end = endDate ? endDate.toLocaleDateString("ja-JP", options) : "現在";
  return `${start} - ${end}`;
}
