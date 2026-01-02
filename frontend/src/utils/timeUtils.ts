/**
 * Get Mountain Time offset in minutes relative to UTC
 */
function getMountainTimeOffset(date: Date): number {
  // Get the same moment in UTC and Mountain Time
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const mtDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Denver' }));

  // Return offset in minutes (will be negative, e.g., -420 for UTC-7)
  return (mtDate.getTime() - utcDate.getTime()) / (1000 * 60);
}

/**
 * Calculate elapsed time from a given ISO date string
 * Returns formatted string like "01s", "04:02" (mm:ss), or "62:00" (after 1 hour)
 *
 * Note: The source data comes in Mountain Time (America/Denver)
 * Formula: User's Current Time - Entered Time (Mountain Time)
 */
export function calculateElapsedTime(enteredDate: string): string {
  // Remove any existing timezone info from the string
  const cleanDate = enteredDate.replace(/Z|([+-]\d{2}:\d{2})$/, '');

  // Parse as UTC by adding 'Z'
  const parsedAsUTC = new Date(cleanDate + 'Z');

  // Get Mountain Time offset in minutes for the current time
  const mtOffsetMinutes = getMountainTimeOffset(new Date());

  // Convert from UTC to the correct timestamp
  // If entered time is "14:30" MT and MT is UTC-7, we need to ADD 7 hours to get UTC time
  // mtOffsetMinutes will be negative (e.g., -420 for UTC-7)
  const enteredTimestamp = parsedAsUTC.getTime() - (mtOffsetMinutes * 60 * 1000);

  // Get current time from user's browser
  const nowTimestamp = Date.now();

  // Calculate difference
  const diffMs = nowTimestamp - enteredTimestamp;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) {
    // Less than 1 minute: show seconds only
    return `${String(diffSeconds).padStart(2, '0')}s`;
  } else if (diffSeconds < 3600) {
    // Less than 1 hour: show mm:ss
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else {
    // 1 hour or more: show minutes only (no seconds)
    const totalMinutes = Math.floor(diffSeconds / 60);
    return `${String(totalMinutes).padStart(2, '0')}:00`;
  }
}

/**
 * Get the timestamp in milliseconds for a given ISO date string
 */
export function getTimestamp(enteredDate: string): number {
  return new Date(enteredDate).getTime();
}
