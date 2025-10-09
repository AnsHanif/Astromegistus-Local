import axiosInstance from '../axios';

export interface PersonDetail {
  fullName: string;
  dateOfBirth: string; // ISO date string
  timeOfBirth?: string;
  placeOfBirth?: string;
}

export interface CreateCoachingSessionBookingRequest {
  sessionId: string;
  providerId?: string; // optional provider ID
  selectedDate: string; // YYYY-MM-DD format
  selectedTime: string; // HH:MM format
  timezone: string; // Timezone string
}

export interface CreateRandomCoachingBookingRequest {
  sessionId: string;
}

export interface CreateRandomBookingRequest {
  productId: string;
  type: 'AUTOMATED' | 'MANUAL';
  persons: PersonDetail[];
}

export interface CreateBookingRequest {
  productId: string;
  itemId: string;
  type: 'AUTOMATED' | 'MANUAL';
  persons: PersonDetail[];
  // Manual booking specific fields
  providerId?: string; // Astrologer/Provider ID for manual bookings
  selectedDate?: string; // YYYY-MM-DD format
  selectedTime?: string; // HH:MM format
  timezone?: string; // Timezone string
}

export interface BookingResponse {
  id: string;
  type: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  persons: PersonDetail[];
  // Manual booking specific fields
  providerId?: string;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  preparationTimeAgreed?: boolean;
}

// New interfaces for astrologer booking management
export interface BookingStats {
  allSessionsToday: number;
  totalPendingSessions: number;
  totalCompletedSessions: number;
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface ClientInfo {
  name: string;
  email: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
}

export interface SessionInfo {
  title: string;
  description?: string;
  duration: string;
  category?: string;
  categories?: string[];
}

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface SessionData {
  id: string;
  type: 'coaching' | 'reading';
  clientName: string;
  clientEmail: string;
  clientInfo?: ClientInfo;
  sessionTitle: string;
  duration: string;
  category: string;
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  providerId?: string;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  providerTimezone?: string;
  userTimezone?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  readingType?: 'AUTOMATED' | 'MANUAL';
  persons?: any[];
  specialQuestions?: QuestionAnswer[];
  price?: number;
  sessionId: string;
  rating?: number;
  feedback?: string;
  // Add meeting link fields
  meetingLink?: string;
  meetingId?: string;
  meetingStatus?: string;
}

export interface SessionPreparationData {
  id: string;
  type: 'coaching' | 'reading';
  client: ClientInfo;
  session: SessionInfo;
  provider?: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
    role: string;
  } | null;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  status?: string;
  price?: number;
  notes?: string;
  materialFiles?: {
    filename: string;
    url: string;
  }[];
  specialQuestions: QuestionAnswer[];
  readingType?: string;
  persons?: any[];
  createdAt?: string;
  // Add meeting link fields
  meetingLink?: string;
  meetingId?: string;
  meetingStatus?: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetStatsParams {}

export interface GetSessionsParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateBookingStatusRequest {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface RescheduleBookingRequest {
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  type?: string;
}

export interface SavePreparationNotesRequest {
  notes: string;
  clientNotes?: string;
}

export interface APIResponse<T> {
  message: string;
  status_code: number;
  data: T;
}

export interface PersonDetailWithQuestions {
  id: string;
  fullName: string;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  questions: QuestionAnswer[];
}

export interface ReadingData {
  id: string;
  type: 'AUTOMATED' | 'MANUAL';
  clientName: string;
  clientEmail: string;
  clientInfo: ClientInfo;
  productName: string;
  productDescription?: string;
  categories: string[];
  automatedPrice: number;
  livePrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  duration: string;
  providerId?: string;
  selectedDate?: string;
  timezone?: string;
  selectedTime?: string;
  userTimezone?: string;
  providerTimezone?: string;
  productId: string;
  completedAt?: string;
  notes?: string;
  persons: PersonDetailWithQuestions[];
  // Add meeting link fields
  meetingLink?: string;
  meetingId?: string;
  meetingStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PastReadingData {
  id: string;
  type: 'AUTOMATED' | 'MANUAL';
  clientName: string;
  clientEmail: string;
  productName: string;
  productDescription?: string;
  categories: string[];
  status: 'COMPLETED';
  providerId?: string;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  completedAt?: string;
  notes?: string;
  persons: PersonDetailWithQuestions[];
  automatedPrice: number;
  livePrice: number;
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

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReadingsResponse {
  readings: ReadingData[];
  pagination: PaginationInfo;
}

export interface PastReadingsResponse {
  readings: PastReadingData[];
  pagination: PaginationInfo;
}

export interface PastSessionData {
  id: string;
  type: string;
  clientName: string;
  clientEmail: string;
  sessionTitle: string;
  duration: string;
  category: string;
  status: 'COMPLETED';
  providerId?: string;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  completedAt?: string;
  notes?: string;
  price: number;
}

export interface SessionsResponse {
  sessions: SessionData[];
  pagination: PaginationInfo;
}

export interface PastSessionsResponse {
  sessions: PastSessionData[];
  pagination: PaginationInfo;
}

export const bookingAPI = {
  // Existing booking creation
  createBooking: async (data: CreateBookingRequest) => {
    const response = await axiosInstance.post<BookingResponse>(
      '/api/products/bookings',
      data
    );
    return response;
  },

  // New coaching session booking creation
  createCoachingSessionBooking: async (
    data: CreateCoachingSessionBookingRequest
  ) => {
    const response = await axiosInstance.post<BookingResponse>(
      '/coaching/coaching-bookings',
      data
    );
    return response;
  },

  // Random booking creation (auto-assign astrologer)
  createRandomBooking: async (data: CreateRandomBookingRequest) => {
    const response = await axiosInstance.post<BookingResponse>(
      '/api/products/bookings/random',
      data
    );
    return response;
  },

  // Random coaching booking creation (auto-assign coach)
  createRandomCoachingBooking: async (
    data: CreateRandomCoachingBookingRequest
  ) => {
    const response = await axiosInstance.post<BookingResponse>(
      '/coaching/coaching-bookings/random',
      data
    );
    return response;
  },

  // Astrologer booking management endpoints
  getAstrologerStats: async (params: GetStatsParams = {}) => {
    const response = await axiosInstance.get<APIResponse<BookingStats>>(
      '/booking/stats',
      { params }
    );
    return response.data;
  },

  getRecentSessions: async (params: GetSessionsParams = {}) => {
    const response = await axiosInstance.get<
      APIResponse<{
        sessions: SessionData[];
        pagination: PaginationResponse;
      }>
    >('/booking/recent', { params });
    return response.data;
  },

  getPastSessions: async (params: GetSessionsParams = {}) => {
    const response = await axiosInstance.get<
      APIResponse<{
        sessions: SessionData[];
        pagination: PaginationResponse;
      }>
    >('/booking/past', { params });
    return response.data;
  },

  getSessionPreparation: async (bookingId: string, type?: string) => {
    const url = type
      ? `/booking/${bookingId}/preparation?type=${type}`
      : `/booking/${bookingId}/preparation`;

    const response =
      await axiosInstance.get<APIResponse<SessionPreparationData>>(url);
    return response.data;
  },

  savePreparationNotes: async (
    bookingId: string,
    data: SavePreparationNotesRequest
  ) => {
    const response = await axiosInstance.post<
      APIResponse<{
        bookingId: string;
        notes: string;
        updatedAt: string;
      }>
    >(`/booking/${bookingId}/notes`, data);
    return response.data;
  },

  updateBookingStatus: async (
    bookingId: string,
    data: UpdateBookingStatusRequest
  ) => {
    const response = await axiosInstance.patch<APIResponse<SessionData>>(
      `/booking/${bookingId}/status`,
      data
    );
    return response.data;
  },

  rescheduleBooking: async (
    bookingId: string,
    data: RescheduleBookingRequest,
    type?: string
  ) => {
    const response = await axiosInstance.patch<APIResponse<SessionData>>(
      `/booking/${bookingId}/reschedule`,
      data
    );
    return response.data;
  },

  getRecentReadings: async (params: { page?: number; limit?: number } = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await axiosInstance.get<{
      message: string;
      status_code: number;
      data: ReadingsResponse;
    }>(`/booking/recent-readings?page=${page}&limit=${limit}`);
    return response;
  },

  getPastReadings: async (params: { page?: number; limit?: number } = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await axiosInstance.get<{
      message: string;
      status_code: number;
      data: PastReadingsResponse;
    }>(`/booking/past-readings?page=${page}&limit=${limit}`);
    return response;
  },

  getTimeSlotsByDateAndId: async (userId: string, date: string) => {
    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: TimeSlot[];
    }>(`/timeslots/user/${userId}/date/${date}`);
    return response.data;
  },

  // Get detailed booking information
  getBookingDetails: async (bookingId: string) => {
    const response = await axiosInstance.get<{
      message: string;
      status_code: number;
      data: ReadingData & {
        user: {
          id: string;
          name: string;
          email: string;
          profilePic?: string;
          dateOfBirth?: string;
          timeOfBirth?: string;
          placeOfBirth?: string;
        };
        product: {
          id: string;
          name: string;
          description?: string;
          categories: string[];
          automatedPrice: number;
          livePrice: number;
          duration: string;
          imageUrl?: string;
        };
        provider?: {
          id: string;
          name: string;
          email: string;
          profilePic?: string;
          role: string;
        };
        pricing: {
          automated: {
            originalPrice: number;
            discountedPrice: number;
            discountPercentage: number;
            hasDiscount: boolean;
          };
          live: {
            originalPrice: number;
            discountedPrice: number;
            discountPercentage: number;
            hasDiscount: boolean;
          };
        };
      };
    }>(`/booking/${bookingId}/details`);
    return response;
  },

  // Get detailed coaching booking information
  getCoachingBookingDetails: async (bookingId: string) => {
    const response = await axiosInstance.get<{
      message: string;
      status_code: number;
      data: {
        id: string;
        status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
        selectedDate?: string;
        selectedTime?: string;
        timezone?: string;
        scheduledAt?: string;
        completedAt?: string;
        notes?: string;
        meetingLink?: string;
        meetingId?: string;
        meetingStatus?: string;
        createdAt: string;
        updatedAt: string;
        user: {
          id: string;
          name: string;
          email: string;
          profilePic?: string;
          dateOfBirth?: string;
          timeOfBirth?: string;
          placeOfBirth?: string;
        };
        session: {
          id: string;
          title: string;
          description?: string;
          duration: string;
          price: number;
          category: string;
          imageUrl?: string;
        };
        provider?: {
          id: string;
          name: string;
          email: string;
          profilePic?: string;
          role: string;
        };
        pricing: {
          price: number;
        };
      };
    }>(`/booking/coaching/${bookingId}/details`);
    return response;
  },

  // ============================================
  // V2 Booking API
  // ============================================

  // Get available slots (unified endpoint for products and coaching)
  getAvailableSlotsV2: async (params: {
    providerId: string;
    productId?: string;
    sessionId?: string;
    date: string;
    timezone?: string; // Optional timezone to view slots in different timezones
  }) => {
    const response = await axiosInstance.get<{
      success: boolean;
      data: {
        name: string; // Product name or session title
        type: 'product' | 'session';
        duration: number;
        date: string;
        timezone: string;
        slots: Array<{
          startDateTimeUTC: string;
          endDateTimeUTC: string;
          displayDate: string;
          displayStartTime: string;
          displayEndTime: string;
          displayTimezone: string;
        }>;
      };
    }>('/timeslots/available-slots', {
      params: {
        providerId: params.providerId,
        productId: params.productId,
        sessionId: params.sessionId,
        date: params.date,
        timezone: params.timezone,
      },
    });
    return response.data;
  },

  // Create a V2 booking
  createBookingV2: async (data: {
    providerId: string;
    productId: string;
    startDateTimeUTC: string;
    endDateTimeUTC: string;
  }) => {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
      data: {
        id: string;
        userId: string;
        providerId: string;
        productId: string;
        startDateTimeUTC: string;
        endDateTimeUTC: string;
        timezone: string;
        type: string;
        status: string;
        createdAt: string;
        updatedAt: string;
      };
    }>('/api/v2/booking/create', data);
    return response.data;
  },

  // Create a V2 coaching booking
  createCoachingBookingV2: async (data: {
    providerId: string;
    sessionId: string;
    // startDateTimeUTC: string;
    // endDateTimeUTC: string;
    selectedDate: string;
    selectedTime: string;
    timezone: string;
  }) => {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
      data: {
        id: string;
        userId: string;
        providerId: string;
        sessionId: string;
        startDateTimeUTC: string;
        endDateTimeUTC: string;
        timezone: string;
        status: string;
        createdAt: string;
        updatedAt: string;
      };
    }>('/api/v2/coaching/booking/create', data);
    return response.data;
  },
};
