import { describe, it, expect } from 'vitest';
import {
  generateRecurrenceDates,
  normalizeDateToUTC,
} from './recurrenceUtils.js';

describe('recurrenceUtils', () => {
  it('should generate daily dates correctly', () => {
    const dates = generateRecurrenceDates({
      frequency: 'DAILY',
      interval: 1,
      startDate: new Date('2026-05-01T00:00:00Z'),
      endDate: new Date('2026-05-05T00:00:00Z'),
    });

    expect(dates).toHaveLength(5);
    expect(dates.map((d) => d.toISOString().split('T')[0])).toEqual([
      '2026-05-01',
      '2026-05-02',
      '2026-05-03',
      '2026-05-04',
      '2026-05-05',
    ]);
  });

  it('should generate weekly dates for specific days of week (Lunes, Miércoles, Viernes)', () => {
    // 2026-05-04 is a Monday
    // 2026-05-15 is a Friday
    // In this 2-week range: Mon 4, Wed 6, Fri 8, Mon 11, Wed 13, Fri 15 = 6 dates
    const dates = generateRecurrenceDates({
      frequency: 'WEEKLY',
      interval: 1,
      daysOfWeek: [1, 3, 5],
      startDate: new Date('2026-05-04T00:00:00Z'),
      endDate: new Date('2026-05-15T00:00:00Z'),
    });

    expect(dates).toHaveLength(6);
    expect(dates.map((d) => d.toISOString().split('T')[0])).toEqual([
      '2026-05-04',
      '2026-05-06',
      '2026-05-08',
      '2026-05-11',
      '2026-05-13',
      '2026-05-15',
    ]);
  });

  it('should throw error if endDate is before startDate', () => {
    expect(() =>
      generateRecurrenceDates({
        frequency: 'DAILY',
        interval: 1,
        startDate: new Date('2026-05-10T00:00:00Z'),
        endDate: new Date('2026-05-01T00:00:00Z'),
      }),
    ).toThrow(
      'La fecha de fin debe ser posterior o igual a la fecha de inicio',
    );
  });

  it('should throw error if range exceeds 3 months', () => {
    expect(() =>
      generateRecurrenceDates({
        frequency: 'DAILY',
        interval: 1,
        startDate: new Date('2026-01-01T00:00:00Z'),
        endDate: new Date('2026-05-01T00:00:00Z'),
      }),
    ).toThrow('La recurrencia no puede extenderse más allá de 3 meses');
  });
});
