import axiosInstance from '../axios';

export interface CreateTimeSlotRequest {
  date: string;
  time: string;
  duration: number;
  preparationTime: number;
}

export interface UpdateTimeSlotRequest {
  date: string;
  time: string;
  duration: number;
  preparationTime: number;
}

export interface TimeSlot {
  id: string;
  userId: string;
  // Old fields (backward compatibility)
  date?: string;
  time?: string;
  duration?: number;
  preparationTime?: number;
  isAvailable?: boolean;
  // V2 fields
  startDateTime?: string; // ISO string
  endDateTime?: string; // ISO string
  timezone?: string;
  slotType?: 'BOOKED';
  bookingId?: string | null;
  coachingBookingId?: string | null;
  // Display fields (converted to user's current timezone by backend)
  localDate?: string; // YYYY-MM-DD
  localStartTime?: string; // hh:mm A
  localEndTime?: string; // hh:mm A
  dayOfMonth?: number; // 1-31
  month?: number; // 1-12
  year?: number;
  dayOfWeek?: number; // 0-6
  displayTimezone?: string;
  startDateTimeUTC?: string; // ISO string
  endDateTimeUTC?: string; // ISO string
  // Relations (when included)
  booking?: {
    id: string;
    status: string;
    product: {
      name: string;
    };
    user: {
      name: string;
      email: string;
    };
  };
  coachingBooking?: {
    id: string;
    status: string;
    session: {
      title: string;
    };
    user: {
      name: string;
      email: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlotApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export const timeSlotAPI = {
  createTimeSlot: (data: CreateTimeSlotRequest) =>
    axiosInstance.post<TimeSlotApiResponse<TimeSlot>>(`/timeslots`, data),

  updateTimeSlot: (id: string, data: UpdateTimeSlotRequest) =>
    axiosInstance.put<TimeSlotApiResponse<TimeSlot>>(`/timeslots/${id}`, data),

  getUserMonthSlots: (year: number, month: number) =>
    axiosInstance.get<TimeSlotApiResponse<TimeSlot[]>>(`/timeslots/month/${year}/${month}`),

  deleteTimeSlot: (id: string) =>
    axiosInstance.delete<TimeSlotApiResponse>(`/timeslots/${id}`),
};