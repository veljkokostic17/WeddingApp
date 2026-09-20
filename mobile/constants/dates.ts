export const months = [
  "januar",
  "februar",
  "mart",
  "april",
  "maj",
  "jun",
  "jul",
  "avgust",
  "septembar",
  "oktobar",
  "novembar",
  "decembar",
];

export function todayAtMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * "2026-05-15" -> a LOCAL Date. Built from the parts on purpose: new Date(iso)
 * parses as UTC midnight, which is the previous day west of Greenwich.
 */
export function parseIsoDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Date -> "2026-05-15", the shape the backend's DateOnly expects. */
export function formatDateForApi(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Date -> "15.05.2026." — the numeric form used on date-picker buttons. */
export function formatDateForDisplay(d: Date) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${d.getFullYear()}.`;
}

/** "2026-05-15" -> "15. maj 2026." — the prose form used in the app's copy. */
export function formatWeddingDate(iso: string) {
  const d = parseIsoDate(iso);
  return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}.`;
}

/** Whole days from today to the wedding. Negative once it's past. */
export function daysUntil(iso: string) {
  const ms = parseIsoDate(iso).getTime() - todayAtMidnight().getTime();
  return Math.round(ms / 86400000);
}

/**
 * Serbian countdown line. Shared by the Home hero and the Profile header so the
 * two can't drift on the day-0 and past-date branches.
 *
 * The days < 0 return must stay ABOVE the modulo — JS % keeps the sign, so
 * -21 % 10 is -1 and the declension check would silently fail.
 */
export function countdownLabel(days: number) {
  if (days === 0) return "Srećno venčanje!";
  if (days < 0) return "Veliki dan je iza vas";
  const noun = days % 10 === 1 && days % 100 !== 11 ? "dan" : "dana";
  return `${days} ${noun} do vašeg velikog dana`;
}
