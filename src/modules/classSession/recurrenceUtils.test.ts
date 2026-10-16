import { describe, it, expect } from 'vitest';
import {
  generateRecurrenceDates,
  normalizeDateToUTC,
} from './recurrenceUtils.js';

describe('recurrenceUtils', () => {
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

  it('should fallback to startDate day of week if daysOfWeek is empty', () => {
    // 2026-05-04 is a Monday, 3 Mondays in range
    const dates = generateRecurrenceDates({
      frequency: 'WEEKLY',
      startDate: new Date('2026-05-04T00:00:00Z'),
      endDate: new Date('2026-05-18T00:00:00Z'),
    });

    expect(dates).toHaveLength(3);
    expect(dates.map((d) => d.toISOString().split('T')[0])).toEqual([
      '2026-05-04',
      '2026-05-11',
      '2026-05-18',
    ]);
  });

  it('should throw error if endDate is before startDate', () => {
    expect(() =>
      generateRecurrenceDates({
        frequency: 'WEEKLY',
        daysOfWeek: [1],
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
        frequency: 'WEEKLY',
        daysOfWeek: [1],
        startDate: new Date('2026-01-01T00:00:00Z'),
        endDate: new Date('2026-05-01T00:00:00Z'),
      }),
    ).toThrow('La recurrencia no puede extenderse más allá de 3 meses');
  });
});
