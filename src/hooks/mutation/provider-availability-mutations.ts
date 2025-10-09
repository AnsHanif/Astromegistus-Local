import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import {
  providerAvailabilityAPI,
  WeeklyAvailabilityInput,
  ProviderSettingsInput,
} from '@/services/api/provider-availability-api';

interface ErrorResponse {
  message: string;
}

export const useSetWeeklyAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ availabilities, daysToDelete }: { availabilities: WeeklyAvailabilityInput[], daysToDelete?: number[] }) =>
      providerAvailabilityAPI.setWeeklyAvailability(availabilities, daysToDelete),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyAvailability'] });
      queryClient.invalidateQueries({ queryKey: ['timeslots'] }); // Invalidate calendar data
      enqueueSnackbar(response.data.message || 'Weekly availability updated successfully', {
        variant: 'success',
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update weekly availability',
        { variant: 'error' }
      );
    },
  });
};

export const useDeleteAvailabilityForDay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dayOfWeek: number) =>
      providerAvailabilityAPI.deleteAvailabilityForDay(dayOfWeek),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyAvailability'] });
      enqueueSnackbar(response.data.message || 'Availability deleted successfully', {
        variant: 'success',
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete availability', {
        variant: 'error',
      });
    },
  });
};

export const useUpdateProviderSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: ProviderSettingsInput) =>
      providerAvailabilityAPI.updateProviderSettings(settings),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['providerSettings'] });
      enqueueSnackbar(response.data.message || 'Settings updated successfully', {
        variant: 'success',
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update settings', {
        variant: 'error',
      });
    },
  });
};
