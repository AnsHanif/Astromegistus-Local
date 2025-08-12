export const DATE_OPTIONS = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return { label: day.toString(), value: day.toString() };
});

export const MONTH_OPTIONS = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

export const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { label: year.toString(), value: year.toString() };
});

export const PLACE_OF_BIRTH_OPTIONS = [
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Canada', value: 'CA' },
  { label: 'Australia', value: 'AU' },
  { label: 'Pakistan', value: 'PK' },
  { label: 'India', value: 'IN' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Italy', value: 'IT' },
  { label: 'Spain', value: 'ES' },
  { label: 'China', value: 'CN' },
  { label: 'Japan', value: 'JP' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Brazil', value: 'BR' },
  { label: 'South Africa', value: 'ZA' },
];

export const GENDER_TYPE = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

export const TIME_OF_BIRTH_HOURS = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 1;
  return {
    label: hour.toString().padStart(2, '0'),
    value: hour.toString().padStart(2, '0'),
  };
});

// Minutes (00–59)
export const TIME_OF_BIRTH_MINUTES = Array.from({ length: 60 }, (_, i) => {
  const minute = i;
  return {
    label: minute.toString().padStart(2, '0'),
    value: minute.toString().padStart(2, '0'),
  };
});

// AM/PM options
export const TIME_OF_BIRTH_PERIOD = [
  { label: 'AM', value: 'AM' },
  { label: 'PM', value: 'PM' },
];
