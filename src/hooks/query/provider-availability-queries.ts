import { useQuery } from '@tanstack/react-query';
import { providerAvailabilityAPI } from '@/services/api/provider-availability-api';

export const useGetWeeklyAvailability = () => {
  return useQuery({
    queryKey: ['weeklyAvailability'],
    queryFn: () => providerAvailabilityAPI.getWeeklyAvailability(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetProviderSettings = () => {
  return useQuery({
    queryKey: ['providerSettings'],
    queryFn: () => providerAvailabilityAPI.getProviderSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetProviderSchedule = (date: string) => {
  return useQuery({
    queryKey: ['providerSchedule', date],
    queryFn: () => providerAvailabilityAPI.getProviderSchedule(date),
    enabled: !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
