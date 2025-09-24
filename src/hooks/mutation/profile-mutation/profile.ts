import { profileAPI } from '@/services/api/profile-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditProfileForm, UpdatePassword, UpdateAstrologerProfile } from './profile-service.type';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { getErrorMessage } from '@/utils/error-handler';
import { AxiosError } from 'axios';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditProfileForm) => {
      const response = await profileAPI.updateProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      closeSnackbar();
      enqueueSnackbar('Profile Updated Successfully', {
        variant: 'success',
      });
    },
    onError: (error: AxiosError) => {
      closeSnackbar();
      enqueueSnackbar(getErrorMessage(error), {
        variant: 'error',
      });
    },
  });
};

export const useUpdateAstrologerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAstrologerProfile) => {
      const response = await profileAPI.updateAstrologerProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      closeSnackbar();
      enqueueSnackbar('Astrologer profile updated successfully!', {
        variant: 'success',
      });
    },
    onError: (error: AxiosError) => {
      closeSnackbar();
      enqueueSnackbar(getErrorMessage(error), {
        variant: 'error',
      });
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: UpdatePassword) => {
      const response = await profileAPI.updatePassword(data);
      return response.data;
    },

    onSuccess: () => {
      closeSnackbar();
      enqueueSnackbar('Password Updated Successfully', {
        variant: 'success',
      });
    },

    onError: (error: AxiosError) => {
      closeSnackbar();
      enqueueSnackbar(getErrorMessage(error), {
        variant: 'error',
      });
    },
  });
};
