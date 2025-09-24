import { useQuery } from '@tanstack/react-query';
import { userAPI, UserQueryParams } from '@/services/api/user-api';

// User Queries (for regular users)
export const useUsers = (params?: UserQueryParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userAPI.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Astrologer Queries
export const useAstrologers = (
  role: 'ASTROMEGISTUS' | 'ASTROMEGISTUS_COACH',
  params?: UserQueryParams
) => {
  return useQuery({
    queryKey: ['astrologers', role, params],
    queryFn: () => userAPI.getAstrologers(role, params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Time Slots Query
export const useTimeSlots = (astrologerId: string, date: string) => {
  return useQuery({
    queryKey: ['time-slots', astrologerId, date],
    queryFn: async () => {
      const response = await userAPI.getTimeSlots(astrologerId, date);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!(astrologerId && date), // Only fetch when we have both astrologerId and date
  });
};
