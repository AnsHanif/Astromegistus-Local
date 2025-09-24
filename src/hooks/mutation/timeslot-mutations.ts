import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timeSlotAPI, CreateTimeSlotRequest } from '@/services/api/timeslot-api';
import { enqueueSnackbar } from 'notistack';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

export const useCreateTimeSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimeSlotRequest) =>
      timeSlotAPI.createTimeSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeslots'] });
      enqueueSnackbar('Time slot created successfully!', {
        variant: 'success',
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to create time slot.',
        { variant: 'error' }
      );
    },
  });
};

export const useDeleteTimeSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => timeSlotAPI.deleteTimeSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeslots'] });
      enqueueSnackbar('Time slot deleted successfully!', {
        variant: 'success',
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to delete time slot.',
        { variant: 'error' }
      );
    },
  });
};