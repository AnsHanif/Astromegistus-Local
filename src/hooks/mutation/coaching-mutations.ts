import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCoachingAPI, coachingAPI } from '@/services/api/coaching-api';
import {
  CreateCoachingSessionRequest,
  CreateCoachingSessionWithImageRequest,
  UpdateCoachingSessionRequest,
  UpdateCoachingSessionWithImageRequest,
} from '@/types/coaching';
import { enqueueSnackbar } from 'notistack';

// Admin Coaching Mutations
export const useCreateCoachingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCoachingSessionRequest) =>
      adminCoachingAPI.createCoachingSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coaching'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Coaching session created successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to create coaching session.',
        { variant: 'error' }
      );
    },
  });
};

export const useCreateCoachingSessionWithImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCoachingSessionWithImageRequest) =>
      adminCoachingAPI.createCoachingSessionWithImage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coaching'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Coaching session created with image successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message ||
          'Failed to create coaching session with image.',
        { variant: 'error' }
      );
    },
  });
};

export const useUpdateCoachingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCoachingSessionRequest;
    }) => adminCoachingAPI.updateCoachingSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coaching'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Coaching session updated successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update coaching session.',
        { variant: 'error' }
      );
    },
  });
};

export const useUpdateCoachingSessionWithImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCoachingSessionWithImageRequest;
    }) => adminCoachingAPI.updateCoachingSessionWithImage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coaching'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Coaching session updated with image successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message ||
          'Failed to update coaching session with image.',
        { variant: 'error' }
      );
    },
  });
};

export const useDeleteCoachingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCoachingAPI.deleteCoachingSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coaching'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Coaching session deleted successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to delete coaching session.',
        { variant: 'error' }
      );
    },
  });
};

export const useEnableCoachingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCoachingAPI.enableCoachingSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coaching'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Coaching session enabled successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to enable coaching session.',
        { variant: 'error' }
      );
    },
  });
};

export const useDisableCoachingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCoachingAPI.disableCoachingSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coaching'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Coaching session disabled successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to disable coaching session.',
        { variant: 'error' }
      );
    },
  });
};

// Coaching Astrologer Mutation - calls POST /coaching/sessions/${sessionId}/astrologer
export const useCoachingAstrologer = () => {
  return useMutation({
    mutationFn: (sessionId: string) =>
      coachingAPI.getAstrologerForSession(sessionId),
    onSuccess: (data) => {
      console.log(
        'Successfully fetched astrologer for coaching session:',
        data
      );
    },
    onError: (error: any) => {
      console.error('Error fetching astrologer for coaching session:', error);
    },
  });
};
