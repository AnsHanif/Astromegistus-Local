import { profileAPI } from '@/services/api/profile-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  EditProfileForm,
  UpdatePassword,
  UpdateAstrologerProfile,
  UpdateProfilePicture,
  CancelSubscriptionForm,
  StripeChangePlanForm,
  UpdateCategories,
} from './profile-service.type';
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

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profilePictureKey: string) => {
      const response = await profileAPI.updateProfilePicture({
        profilePictureKey,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      closeSnackbar();
      enqueueSnackbar('Profile image updated successfully!', {
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

export const useCancelSubscription = () => {
  return useMutation({
    mutationFn: async (data: CancelSubscriptionForm) => {
      const response = await profileAPI.cancelSubscription(data);
      return response.data;
    },
  });
};

export const useStripeChangePlan = () => {
  return useMutation({
    mutationFn: async (data: StripeChangePlanForm) => {
      const response = await profileAPI.stripeChangePlan(data);
      return response.data;
    },
  });
};

export const useUpdateTimezone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timeZone: string) => {
      const response = await profileAPI.updateTimezone(timeZone);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      closeSnackbar();
      enqueueSnackbar('Timezone updated successfully!', {
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

export const useUpdateCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCategories) => {
      const response = await profileAPI.updateCategories(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      closeSnackbar();
      enqueueSnackbar('Categories updated successfully!', {
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
