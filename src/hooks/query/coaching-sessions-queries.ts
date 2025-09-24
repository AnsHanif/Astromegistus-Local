import { coachingAPI } from '@/services/api/coaching-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

interface CoachingQueryParams {
  search?: string;
  filters?: {
    category?: string;
    priceRange?: string;
    duration?: string;
  };
  limit?: number;
}

export const useGetAllCoachingSessions = (params: CoachingQueryParams = {}) => {
  const { search = '', filters = {}, limit = 4 } = params;

  return useInfiniteQuery({
    queryKey: ['coaching-sessions', { search, ...filters, limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await coachingAPI.getAllCoachingSessions({
        page: pageParam as number,
        limit,
        search,
        ...filters,
      });
      return response.data; // Direct access to response.data since your API returns {sessions, pagination}
    },
    getNextPageParam: (lastPage: any, allPages) => {
      if (lastPage && lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useGetCoachingSessionDetail = (id: string) => {
  return useQuery({
    queryKey: ['coaching-session-details', id],
    queryFn: async () => {
      const response = await coachingAPI.getSingleCoachingSession(id);
      return response?.data?.data;
    },
    enabled: !!id,
  });
};
