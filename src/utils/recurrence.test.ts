import { describe, it, expect } from 'vitest';
import { generateOccurrenceDates, MAX_OCCURRENCES } from './recurrence.js';

const iso = (dates: Date[]) => dates.map((d) => d.toISOString().slice(0, 10));

describe('generateOccurrenceDates', () => {
  it('DAILY: genera una fecha por día, incluyendo inicio y fin', () => {
    const dates = generateOccurrenceDates({
      frequency: 'DAILY',
      interval: 1,
      startDate: new Date('2026-11-02'),
      endDate: new Date('2026-11-05'),
    });
    expect(iso(dates)).toEqual(['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05']);
  });

  it('WEEKLY: repite el mismo día de la semana', () => {
    const dates = generateOccurrenceDates({
      frequency: 'WEEKLY',
      interval: 1,
      startDate: new Date('2026-11-02'), // lunes
      endDate: new Date('2026-11-30'),
    });
    expect(iso(dates)).toEqual(['2026-11-02', '2026-11-09', '2026-11-16', '2026-11-23', '2026-11-30']);
  });

  it('WEEKLY con intervalo 2: cada dos semanas', () => {
    const dates = generateOccurrenceDates({
      frequency: 'WEEKLY',
      interval: 2,
      startDate: new Date('2026-11-02'),
      endDate: new Date('2026-11-30'),
    });
    expect(iso(dates)).toEqual(['2026-11-02', '2026-11-16', '2026-11-30']);
  });

  it('MONTHLY: salta los meses que no tienen ese día (31)', () => {
    const dates = generateOccurrenceDates({
      frequency: 'MONTHLY',
      interval: 1,
      startDate: new Date('2026-01-31'),
      endDate: new Date('2026-05-31'),
    });
    expect(iso(dates)).toEqual(['2026-01-31', '2026-03-31', '2026-05-31']);
  });

  it('si endDate es anterior a startDate no genera nada', () => {
    const dates = generateOccurrenceDates({
      frequency: 'DAILY',
      interval: 1,
      startDate: new Date('2026-11-10'),
      endDate: new Date('2026-11-01'),
    });
    expect(dates).toEqual([]);
  });

  it('genera MAX_OCCURRENCES + 1 como máximo para que el servicio detecte el exceso', () => {
    const dates = generateOccurrenceDates({
      frequency: 'DAILY',
      interval: 1,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2027-12-31'),
    });
    expect(dates).toHaveLength(MAX_OCCURRENCES + 1);
  });
});