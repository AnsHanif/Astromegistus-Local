import axiosInstance from '../axios';

export interface CreateTimeSlotRequest {
  date: string;
  time: string;
  duration: number;
  preparationTime: number;
}

export interface TimeSlot {
  id: string;
  userId: string;
  date: string;
  time: string;
  duration: number;
  preparationTime: number;
  isAvailable: boolean;
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

  getUserMonthSlots: (year: number, month: number) =>
    axiosInstance.get<TimeSlotApiResponse<TimeSlot[]>>(`/timeslots/month/${year}/${month}`),
    
  deleteTimeSlot: (id: string) =>
    axiosInstance.delete<TimeSlotApiResponse>(`/timeslots/${id}`),
};