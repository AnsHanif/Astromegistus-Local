import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { timeSlotAPI, CreateTimeSlotRequest, UpdateTimeSlotRequest } from '@/services/api/timeslot-api';
import { enqueueSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { RootState } from '@/store/store';

interface ErrorResponse {
  message: string;
}

export const useCreateTimeSlot = () => {
  const queryClient = useQueryClient();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userId = currentUser?.id;

  return useMutation({
    mutationFn: (data: CreateTimeSlotRequest) =>
      timeSlotAPI.createTimeSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeslots', 'month', userId] });
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

export const useUpdateTimeSlot = () => {
  const queryClient = useQueryClient();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userId = currentUser?.id;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimeSlotRequest }) =>
      timeSlotAPI.updateTimeSlot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeslots', 'month', userId] });
      enqueueSnackbar('Time slot updated successfully!', {
        variant: 'success',
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update time slot.',
        { variant: 'error' }
      );
    },
  });
};

export const useDeleteTimeSlot = () => {
  const queryClient = useQueryClient();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userId = currentUser?.id;

  return useMutation({
    mutationFn: (id: string) => timeSlotAPI.deleteTimeSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeslots', 'month', userId] });
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