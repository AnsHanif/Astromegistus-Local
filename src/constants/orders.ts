// Order Status Constants
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

// Reading Type Constants
export const READING_TYPE = {
  AUTOMATED: 'AUTOMATED',
  MANUAL: 'MANUAL',
} as const;

export type ReadingType = typeof READING_TYPE[keyof typeof READING_TYPE];

// Coaching Category Constants
export const COACHING_CATEGORY = {
  LIFE_COACHES: 'LIFE_COACHES',
  CAREER_COACHES: 'CAREER_COACHES',
  RELATIONSHIP_COACHES: 'RELATIONSHIP_COACHES',
} as const;

export type CoachingCategory = typeof COACHING_CATEGORY[keyof typeof COACHING_CATEGORY];

// Product Type Constants
export const PRODUCT_TYPE = {
  READING: 'READING',
  LIVE_SESSIONS: 'LIVE_SESSIONS',
  BOTH: 'BOTH',
} as const;

export type ProductType = typeof PRODUCT_TYPE[keyof typeof PRODUCT_TYPE];

// Product Category Constants
export const PRODUCT_CATEGORY = {
  CHART_READING: 'CHART_READING',
  LIVE_READING: 'LIVE_READING',
  COACHING_SESSION: 'COACHING_SESSION',
  ASTROLOGY_COURSE: 'ASTROLOGY_COURSE',
  CONSULTATION: 'CONSULTATION',
  OTHER: 'OTHER',
  CORE_INTEGRATIVE: 'CORE_INTEGRATIVE',
  NATAL_READING: 'NATAL_READING',
  PREDICTIVE: 'PREDICTIVE',
  CAREER: 'CAREER',
  HORARY: 'HORARY',
  SYNASTRY: 'SYNASTRY',
  ASTROCARTOGRAPHY: 'ASTROCARTOGRAPHY',
  ELECTIONAL: 'ELECTIONAL',
  SOLAR_RETURN: 'SOLAR_RETURN',
  DRACONIC_NATAL_OVERLAY: 'DRACONIC_NATAL_OVERLAY',
  NATAL: 'NATAL',
} as const;

export type ProductCategory = typeof PRODUCT_CATEGORY[keyof typeof PRODUCT_CATEGORY];

// User Role Constants
export const USER_ROLE = {
  GUEST: 'GUEST',
  PAID: 'PAID',
  ASTROMEGISTUS: 'ASTROMEGISTUS',
  ASTROMEGISTUS_COACH: 'ASTROMEGISTUS_COACH',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

// Filter Options for UI
export const FILTER_OPTIONS = {
  ALL: 'All',
} as const;

// Status Filter Options
export const STATUS_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Status', value: FILTER_OPTIONS.ALL },
  { label: 'Pending', value: BOOKING_STATUS.PENDING },
  { label: 'Confirmed', value: BOOKING_STATUS.CONFIRMED },
  { label: 'Completed', value: BOOKING_STATUS.COMPLETED },
  { label: 'Cancelled', value: BOOKING_STATUS.CANCELLED },
];

// Reading Type Filter Options
export const READING_TYPE_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Types', value: FILTER_OPTIONS.ALL },
  { label: 'Automated', value: READING_TYPE.AUTOMATED },
  { label: 'Manual', value: READING_TYPE.MANUAL },
];

// Coaching Category Filter Options
export const COACHING_CATEGORY_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Categories', value: FILTER_OPTIONS.ALL },
  { label: 'Life Coach', value: COACHING_CATEGORY.LIFE_COACHES },
  { label: 'Career Coach', value: COACHING_CATEGORY.CAREER_COACHES },
  { label: 'Relationship Coach', value: COACHING_CATEGORY.RELATIONSHIP_COACHES },
];

// Status Display Labels
export const STATUS_LABELS: Record<BookingStatus, string> = {
  [BOOKING_STATUS.PENDING]: 'Pending',
  [BOOKING_STATUS.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUS.COMPLETED]: 'Completed',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
};

// Reading Type Display Labels
export const READING_TYPE_LABELS: Record<ReadingType, string> = {
  [READING_TYPE.AUTOMATED]: 'Automated',
  [READING_TYPE.MANUAL]: 'Manual',
};

// Coaching Category Display Labels
export const COACHING_CATEGORY_LABELS: Record<CoachingCategory, string> = {
  [COACHING_CATEGORY.LIFE_COACHES]: 'Life Coach',
  [COACHING_CATEGORY.CAREER_COACHES]: 'Career Coach',
  [COACHING_CATEGORY.RELATIONSHIP_COACHES]: 'Relationship Coach',
};

// Status Colors for UI
export const STATUS_COLORS: Record<BookingStatus, string> = {
  [BOOKING_STATUS.PENDING]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  [BOOKING_STATUS.CONFIRMED]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  [BOOKING_STATUS.COMPLETED]: 'bg-green-500/20 text-green-400 border-green-500/30',
  [BOOKING_STATUS.CANCELLED]: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// Reading Type Colors for UI
export const READING_TYPE_COLORS: Record<ReadingType, string> = {
  [READING_TYPE.AUTOMATED]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  [READING_TYPE.MANUAL]: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

// Coaching Category Colors for UI
export const COACHING_CATEGORY_COLORS: Record<CoachingCategory, string> = {
  [COACHING_CATEGORY.LIFE_COACHES]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  [COACHING_CATEGORY.CAREER_COACHES]: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  [COACHING_CATEGORY.RELATIONSHIP_COACHES]: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

// Filter Types for TypeScript
export type StatusFilter = typeof FILTER_OPTIONS.ALL | BookingStatus;
export type ReadingTypeFilter = typeof FILTER_OPTIONS.ALL | ReadingType;
export type CoachingCategoryFilter = typeof FILTER_OPTIONS.ALL | CoachingCategory;