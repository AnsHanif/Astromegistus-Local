/**
 * Comprehensive list of timezones in IANA format
 * Organized by region for better UX
 */

export interface TimezoneOption {
  label: string;
  value: string; // IANA timezone
  offset: string;
}

export const TIMEZONES: TimezoneOption[] = [
  // North America
  { label: 'Pacific Time - Los Angeles', value: 'America/Los_Angeles', offset: 'GMT-8' },
  { label: 'Mountain Time - Denver', value: 'America/Denver', offset: 'GMT-7' },
  { label: 'Central Time - Chicago', value: 'America/Chicago', offset: 'GMT-6' },
  { label: 'Eastern Time - New York', value: 'America/New_York', offset: 'GMT-5' },

  // Europe
  { label: 'London (GMT)', value: 'Europe/London', offset: 'GMT+0' },
  { label: 'Paris (CET)', value: 'Europe/Paris', offset: 'GMT+1' },
  { label: 'Athens (EET)', value: 'Europe/Athens', offset: 'GMT+2' },
  { label: 'Moscow', value: 'Europe/Moscow', offset: 'GMT+3' },

  // Asia
  { label: 'Dubai', value: 'Asia/Dubai', offset: 'GMT+4' },
  { label: 'Karachi', value: 'Asia/Karachi', offset: 'GMT+5' },
  { label: 'Dhaka', value: 'Asia/Dhaka', offset: 'GMT+6' },
  { label: 'Bangkok', value: 'Asia/Bangkok', offset: 'GMT+7' },
  { label: 'Singapore', value: 'Asia/Singapore', offset: 'GMT+8' },
  { label: 'Tokyo', value: 'Asia/Tokyo', offset: 'GMT+9' },
  { label: 'Sydney', value: 'Australia/Sydney', offset: 'GMT+10' },

  // Others
  { label: 'Auckland', value: 'Pacific/Auckland', offset: 'GMT+12' },
];

/**
 * Get user's current timezone from browser
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Get timezone label from IANA timezone string
 */
export const getTimezoneLabel = (timezone: string): string => {
  const found = TIMEZONES.find(tz => tz.value === timezone);
  return found ? found.label : timezone;
};
