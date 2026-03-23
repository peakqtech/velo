const FREQUENCY_INTERVALS: Record<string, number> = {
  daily: 1,
  "2x_week": 3.5,
  "3x_week": 2.33,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

/**
 * Generate an array of ISO date strings between startDate and endDate
 * at the given frequency interval.
 */
export function mapScheduleToDates(
  startDate: string,
  endDate: string,
  frequency: string
): string[] {
  const intervalDays = FREQUENCY_INTERVALS[frequency.toLowerCase()];
  if (!intervalDays) {
    throw new Error(`Unknown frequency: "${frequency}". Valid values: ${Object.keys(FREQUENCY_INTERVALS).join(", ")}`);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const intervalMs = intervalDays * 24 * 60 * 60 * 1000;

  const dates: string[] = [];
  let current = start.getTime();

  while (current <= end.getTime()) {
    dates.push(new Date(current).toISOString().split("T")[0]);
    current += intervalMs;
  }

  return dates;
}
