import axiosInstance from '../axios';

// ============================================
// Types & Interfaces
// ============================================

export interface WeeklyAvailabilityInput {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface WeeklyAvailability {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSettings {
  id: string;
  userId: string;
  bufferTime: number; // minutes between slots
  minBookingNotice: number; // hours in advance
  maxBookingDays: number; // days in future
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSettingsInput {
  bufferTime?: number;
  minBookingNotice?: number;
  maxBookingDays?: number;
}

export interface ScheduleSlot {
  id: string;
  type: 'BOOKED';
  startTime: string;
  endTime: string;
  startDateTimeUTC: string;
  endDateTimeUTC: string;
  clientName?: string;
  clientEmail?: string;
  clientTimezone?: string;
  serviceName?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface WeeklyAvailabilityResponse {
  availabilities: WeeklyAvailability[];
  settings: ProviderSettings;
}

// ============================================
// Provider Availability API
// ============================================

export const providerAvailabilityAPI = {
  // Weekly Availability
  setWeeklyAvailability: (availabilities: WeeklyAvailabilityInput[], daysToDelete?: number[]) =>
    axiosInstance.post<ApiResponse<{ count: number }>>(
      `/provider/availability/weekly`,
      { availabilities, daysToDelete }
    ),

  getWeeklyAvailability: () =>
    axiosInstance.get<ApiResponse<WeeklyAvailabilityResponse>>(
      `/provider/availability/weekly`
    ),

  deleteAvailabilityForDay: (dayOfWeek: number) =>
    axiosInstance.delete<ApiResponse>(
      `/provider/availability/day/${dayOfWeek}`
    ),

  // Provider Settings
  updateProviderSettings: (settings: ProviderSettingsInput) =>
    axiosInstance.put<ApiResponse<ProviderSettings>>(
      `/provider/settings`,
      settings
    ),

  getProviderSettings: () =>
    axiosInstance.get<ApiResponse<ProviderSettings>>(
      `/provider/settings`
    ),

  // Schedule View
  getProviderSchedule: (date: string) =>
    axiosInstance.get<ApiResponse<ScheduleSlot[]>>(
      `/provider/schedule?date=${date}`
    ),
};
