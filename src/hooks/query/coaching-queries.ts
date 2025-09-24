import { useQuery } from '@tanstack/react-query';
import {
  publicCoachingAPI,
  adminCoachingAPI,
} from '@/services/api/coaching-api';
import { CoachingQueryParams } from '@/types/coaching';

// Public Coaching Queries (for users)
export const useCoachingSessions = (params?: CoachingQueryParams) => {
  return useQuery({
    queryKey: ['coaching', 'sessions', params],
    queryFn: async () => {
      const response = await publicCoachingAPI.getCoachingSessions(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCoachingSession = (id: string) => {
  return useQuery({
    queryKey: ['coaching', 'session', id],
    queryFn: async () => {
      const response = await publicCoachingAPI.getCoachingSessionById(id);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
    retry: 2,
  });
};

// Admin Coaching Queries (for admin management)
export const useAdminCoachingSessions = (params?: CoachingQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'coaching', 'sessions', params],
    queryFn: async () => {
      const response = await adminCoachingAPI.getCoachingSessions(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

export const useAdminCoachingSession = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'coaching', 'session', id],
    queryFn: async () => {
      const response = await adminCoachingAPI.getCoachingSessionById(id);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!id,
    retry: 2,
  });
};

// Booking queries removed for now
