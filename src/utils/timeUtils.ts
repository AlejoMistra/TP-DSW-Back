/**
 * Calculates the end time given a start time in HH:mm and duration in minutes
 * @param startTime string in HH:mm format
 * @param durationMinutes number of minutes
 * @returns string in HH:mm format
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

/**
 * Converts a time string in HH:mm format to total minutes since 00:00
 * @param time string in HH:mm format
 * @returns number of minutes
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Checks if two time intervals overlap
 * @param startA string in HH:mm format
 * @param durationA number of minutes
 * @param startB string in HH:mm format
 * @param durationB number of minutes
 * @returns true if the intervals overlap, false otherwise
 */
export function doIntervalsOverlap(
  startA: string,
  durationA: number,
  startB: string,
  durationB: number
): boolean {
  const startAMinutes = timeToMinutes(startA);
  const endAMinutes = startAMinutes + durationA;
  
  const startBMinutes = timeToMinutes(startB);
  const endBMinutes = startBMinutes + durationB;
  
  // Overlap condition: Start of A is before End of B AND End of A is after Start of B
  return startAMinutes < endBMinutes && endAMinutes > startBMinutes;
}
