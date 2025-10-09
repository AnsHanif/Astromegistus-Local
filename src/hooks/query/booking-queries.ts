import { useQuery } from '@tanstack/react-query';
import {
  bookingAPI,
  GetStatsParams,
  GetSessionsParams,
  BookingStats,
  SessionData,
  SessionPreparationData,
  PaginationResponse,
} from '@/services/api/booking-api';

// Hook for fetching astrologer booking statistics
export const useBookingStats = (params: GetStatsParams = {}) => {
  return useQuery({
    queryKey: ['booking-stats', params],
    queryFn: () => bookingAPI.getAstrologerStats(params),
  });
};

// Hook for fetching recent sessions
export const useRecentSessions = (params: GetSessionsParams = {}) => {
  return useQuery({
    queryKey: ['recent-sessions', params],
    queryFn: () => bookingAPI.getRecentSessions(params),
  });
};

// Hook for fetching past sessions
export const usePastSessions = (params: GetSessionsParams = {}) => {
  return useQuery({
    queryKey: ['past-sessions', params],
    queryFn: () => bookingAPI.getPastSessions(params),
  });
};

// Hook for fetching session preparation data
export const useSessionPreparation = (
  bookingId: string,
  type?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['session-preparation', bookingId],
    queryFn: () => bookingAPI.getSessionPreparation(bookingId, type),
    enabled: enabled && !!bookingId,
  });
};

// Helper hook for dashboard overview combining multiple queries
export const useDashboardOverview = () => {
  const statsQuery = useBookingStats({});

  const recentSessionsQuery = useRecentSessions({
    page: 1,
    limit: 5,
  });

  return {
    stats: statsQuery,
    recentSessions: recentSessionsQuery,
    isLoading: statsQuery.isLoading || recentSessionsQuery.isLoading,
    isError: statsQuery.isError || recentSessionsQuery.isError,
    error: statsQuery.error || recentSessionsQuery.error,
  };
};

// Hook for infinite scrolling sessions (for future enhancement)
export const useInfiniteRecentSessions = (
  params: Omit<GetSessionsParams, 'page'> = {}
) => {
  const limit = params.limit || 10;

  return useQuery({
    queryKey: ['infinite-recent-sessions', params],
    queryFn: ({ pageParam = 1 }) =>
      bookingAPI.getRecentSessions({
        ...params,
        page: pageParam as number,
        limit,
      }),
  });
};

// Hook for fetching recent readings
export const useRecentReadings = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['readings', 'recent', params],
    queryFn: async () => {
      const response = await bookingAPI.getRecentReadings(params);
      return response.data.data;
    },
  });
};

// Hook for fetching past readings
export const usePastReadings = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['readings', 'past', params],
    queryFn: async () => {
      const response = await bookingAPI.getPastReadings(params);
      return response.data.data;
    },
  });
};

// Hook for fetching time slots by date and user ID
export const useTimeSlotsByDateAndId = (
  userId: string | undefined,
  date: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['timeslots', userId, date],
    queryFn: () => bookingAPI.getTimeSlotsByDateAndId(userId!, date!),
    enabled: enabled && !!userId && !!date,
  });
};

// Hook for fetching detailed booking information
export const useBookingDetails = (
  bookingId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['booking-details', bookingId],
    queryFn: async () => {
      const response = await bookingAPI.getBookingDetails(bookingId);
      return response.data.data;
    },
    enabled: enabled && !!bookingId,
  });
};

// Hook for fetching detailed coaching booking information
export const useCoachingBookingDetails = (
  bookingId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['coaching-booking-details', bookingId],
    queryFn: async () => {
      const response = await bookingAPI.getCoachingBookingDetails(bookingId);
      return response.data.data;
    },
    enabled: enabled && !!bookingId,
  });
};

// Hook for fetching available slots (unified for products and coaching)
export const useAvailableSlots = (
  providerId: string | undefined,
  productId: string | undefined,
  sessionId: string | undefined,
  date: string | undefined,
  timezone?: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [
      'available-slots-v2',
      providerId,
      productId,
      sessionId,
      date,
      timezone,
    ],
    queryFn: () =>
      bookingAPI.getAvailableSlotsV2({
        providerId: providerId!,
        productId,
        sessionId,
        date: date!,
        timezone,
      }),
    enabled: enabled && !!providerId && (!!productId || !!sessionId) && !!date,
    staleTime: 30000, // 30 seconds
  });
};
