import { useQuery } from '@tanstack/react-query';
import {
  getRadioShows,
  getRadioShowById,
  getAdminRadioShows,
  getAdminRadioShowById,
  RadioShowQueryParams,
} from '@/services/api/radio-show-api';

// Public hooks
export const useRadioShows = (params: RadioShowQueryParams = {}) => {
  return useQuery({
    queryKey: ['radioShows', params],
    queryFn: () => getRadioShows(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRadioShow = (id: string) => {
  return useQuery({
    queryKey: ['radioShow', id],
    queryFn: () => getRadioShowById(id),
    enabled: !!id,
  });
};

// Admin hooks
export const useAdminRadioShows = (params: RadioShowQueryParams = {}) => {
  return useQuery({
    queryKey: ['adminRadioShows', params],
    queryFn: () => getAdminRadioShows(params),
    staleTime: 1 * 60 * 1000, // 1 minute for admin
  });
};

export const useAdminRadioShow = (id: string) => {
  return useQuery({
    queryKey: ['adminRadioShow', id],
    queryFn: () => getAdminRadioShowById(id),
    enabled: !!id,
  });
};