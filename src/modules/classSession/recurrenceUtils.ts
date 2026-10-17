import { BadRequestError } from '../../utils/errors.js';

export interface RecurrenceConfig {
  frequency?: 'WEEKLY';
  daysOfWeek?: number[]; // 1 = Lunes, 2 = Martes, ..., 7 = Domingo
  startDate: Date | string;
  endDate: Date | string;
}

const MAX_SESSIONS_LIMIT = 35;
const MAX_MONTHS_LIMIT = 1;

/**
 * Normaliza una fecha a las 00:00:00 UTC para evitar desfases horarios
 */
export function normalizeDateToUTC(dateInput: Date | string): Date {
  const d = new Date(dateInput);
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
  );
}

/**
 * Genera el array de fechas que caen dentro de la serie recurrente semanal
 */
export function generateRecurrenceDates(config: RecurrenceConfig): Date[] {
  const start = normalizeDateToUTC(config.startDate);
  const end = normalizeDateToUTC(config.endDate);

  if (end < start) {
    throw new BadRequestError(
      'La fecha de fin debe ser posterior o igual a la fecha de inicio',
    );
  }

  // Validar tope de 1 mes
  const maxAllowedDate = new Date(start);
  maxAllowedDate.setUTCMonth(maxAllowedDate.getUTCMonth() + MAX_MONTHS_LIMIT);
  if (end > maxAllowedDate) {
    throw new BadRequestError(
      `La recurrencia no puede extenderse más allá de ${MAX_MONTHS_LIMIT} mes`,
    );
  }

  const dates: Date[] = [];
  const current = new Date(start);

  // Si no se proveyeron días específicos, usar el día de la semana de startDate
  // JS getUTCDay: 0=Domingo, 1=Lunes... Convertir a 1=Lunes ... 7=Domingo
  const fallbackDay = start.getUTCDay() === 0 ? 7 : start.getUTCDay();
  const targetDays =
    config.daysOfWeek && config.daysOfWeek.length > 0
      ? config.daysOfWeek
      : [fallbackDay];

  // Iterar día a día en el rango y seleccionar los días de la semana configurados
  while (current <= end) {
    const dayOfWeek = current.getUTCDay() === 0 ? 7 : current.getUTCDay();
    if (targetDays.includes(dayOfWeek)) {
      dates.push(new Date(current));
      if (dates.length > MAX_SESSIONS_LIMIT) {
        throw new BadRequestError(
          `La serie supera el límite de ${MAX_SESSIONS_LIMIT} clases`,
        );
      }
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  if (dates.length === 0) {
    throw new BadRequestError(
      'El rango y días seleccionados no generan ninguna clase válida',
    );
  }

  return dates;
}
