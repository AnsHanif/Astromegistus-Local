export const PRODUCT_CATEGORIES = [
  { label: 'Core Integrative', value: 'CORE_INTEGRATIVE' },
  { label: 'Natal Reading', value: 'NATAL_READING' },
  { label: 'Predictive', value: 'PREDICTIVE' },
  { label: 'Career', value: 'CAREER' },
  { label: 'Horary', value: 'HORARY' },
  { label: 'Synastry', value: 'SYNASTRY' },
  { label: 'Astrocartography', value: 'ASTROCARTOGRAPHY' },
  { label: 'Electional', value: 'ELECTIONAL' },
  { label: 'Solar Return', value: 'SOLAR_RETURN' },
  { label: 'Draconic Natal Overlay', value: 'DRACONIC_NATAL_OVERLAY' },
  { label: 'Natal', value: 'NATAL' },
  { label: 'Life Coaches', value: 'LIFE_COACHES' },
  { label: 'Career Coaches', value: 'CAREER_COACHES' },
  { label: 'Relationship Coaches', value: 'RELATIONSHIP_COACHES' },
];

export const PRODUCT_TYPES = [
  { label: 'Live Session', value: 'live' },
  { label: 'Manual Session', value: 'manual' },
  { label: 'Automated Session', value: 'automated' },
  { label: 'One-on-One Consultation', value: 'consultation' },
  { label: 'Pre-recorded Video', value: 'video' },
  { label: 'Live Webinar', value: 'webinar' },
  { label: 'Audio Guidance', value: 'audio' },
];

export const PRICE_RANGES = [
  { label: 'Under $20', value: 'under-20' },
  { label: '$20 - $50', value: '20-50' },
  { label: '$50 - $100', value: '50-100' },
  { label: '$100 - $200', value: '100-200' },
  { label: 'Above $200', value: 'above-200' },
];

// Price range mapping for API calls
export const PRICE_RANGE_MAPPING = {
  'under-20': { minPrice: 0, maxPrice: 20 },
  '20-50': { minPrice: 20, maxPrice: 50 },
  '50-100': { minPrice: 50, maxPrice: 100 },
  '100-200': { minPrice: 100, maxPrice: 200 },
  'above-200': { minPrice: 200, maxPrice: null },
};

// Time Duration
export const TIME_DURATIONS = [
  { label: '15-30 min', value: '15-30 min' },
  { label: '30-45 min', value: '30-45 min' },
  { label: '30-60 min', value: '30-60 min' },
  { label: '45-60 min', value: '45-60 min' },
  { label: '60-75 min', value: '60-75 min' },
  { label: '60-90 min', value: '60-90 min' },
  { label: '75-90 min', value: '75-90 min' },
  { label: '90-120 min', value: '90-120 min' },
];

export const productFeatures = [
  'Lorem ipsum dolor sit amet consectetur.',
  'Lorem ipsum dolor sit amet consectetur.',
  'Lorem ipsum dolor sit amet consectetur.',
  'Lorem ipsum dolor sit amet consectetur.',
  'Lorem ipsum dolor sit amet consectetur.',
  'Lorem ipsum dolor sit amet consectetur.',
  'Lorem ipsum dolor sit amet consectetur.',
];
