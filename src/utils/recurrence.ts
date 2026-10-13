export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export const MAX_OCCURRENCES = 104;
const DAY_MS = 24 * 60 * 60 * 1000;

const toUtcMidnight = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

export const startOfTodayUtc = () => toUtcMidnight(new Date());

export function generateOccurrenceDates(rule: {
  frequency: RecurrenceFrequency;
  interval: number;
  startDate: Date;
  endDate: Date;
}): Date[] {
  const start = toUtcMidnight(rule.startDate);
  const end = toUtcMidnight(rule.endDate);
  const dates: Date[] = [];

  // Se genera hasta MAX + 1 para que el servicio pueda detectar que se pasó del tope
  for (let n = 0; dates.length <= MAX_OCCURRENCES; n++) {
    let candidate: Date;

    if (rule.frequency === 'MONTHLY') {
      candidate = new Date(
        Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + n * rule.interval, start.getUTCDate()),
      );
      // Meses sin ese día (ej. 31): se saltean, como hace Google Calendar
      if (candidate.getUTCDate() !== start.getUTCDate()) {
        if (candidate > end) break;
        continue;
      }
    } else {
      const stepDays = rule.frequency === 'DAILY' ? 1 : 7;
      candidate = new Date(start.getTime() + n * rule.interval * stepDays * DAY_MS);
    }

    if (candidate > end) break;
    dates.push(candidate);
  }
  return dates;
}