import { s3ImageAPI } from '@/services/api/s3-image-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { getErrorMessage } from '@/utils/error-handler';
import { AxiosError } from 'axios';

interface ProfileImageUploadResponse {
  success: boolean;
  message: string;
  data: {
    imageKey: string;
    type: string;
  };
}

interface ProfileImageUrlResponse {
  success: boolean;
  message: string;
  data: {
    imageKey: string;
    imageUrl: string;
    expiresIn: number;
  };
}

interface ProfileImageDeleteResponse {
  success: boolean;
  message: string;
  data: {
    imageKey: string;
  };
}

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<ProfileImageUploadResponse> => {
      const response = await s3ImageAPI.uploadProfileImageKey(file);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      closeSnackbar();
      enqueueSnackbar('Profile image uploaded successfully!', {
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

export const useGetProfileImageUrl = () => {
  return useMutation({
    mutationFn: async (imageKey: string): Promise<ProfileImageUrlResponse> => {
      const response = await s3ImageAPI.getProfileImageByKey(imageKey);
      return response.data;
    },
    onError: (error: AxiosError) => {
      console.error('Failed to get profile image URL:', error);
      closeSnackbar();
      enqueueSnackbar('Failed to load profile image', {
        variant: 'error',
      });
    },
  });
};

export const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageKey: string): Promise<ProfileImageDeleteResponse> => {
      const response = await s3ImageAPI.deleteProfileImageByKey(imageKey);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      closeSnackbar();
      enqueueSnackbar('Profile image deleted successfully!', {
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

export const useUpdateProfileWithImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ imageKey, userId }: { imageKey: string; userId: string }) => {
      // This would be an API call to update user's profilePic field with the imageKey
      // For now, we'll just return the imageKey since we need to update the profile API
      return { imageKey, userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      closeSnackbar();
      enqueueSnackbar('Profile updated with new image!', {
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