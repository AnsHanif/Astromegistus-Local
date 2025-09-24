import {
  EditProfileForm,
  UpdatePassword,
  UpdateAstrologerProfile,
  AstrologerProfileResponse,
  ApiResponse,
  UserProfile,
} from '@/hooks/mutation/profile-mutation/profile-service.type';
import axiosInstance from '../axios';

export const profileAPI = {
  getUserProfile: () =>
    axiosInstance.get<ApiResponse<UserProfile>>(`/profile`),

  updateProfile: (data: EditProfileForm) =>
    axiosInstance.patch<ApiResponse>(`/profile/update`, data),

  updateAstrologerProfile: (data: UpdateAstrologerProfile) =>
    axiosInstance.patch<ApiResponse<AstrologerProfileResponse>>(`/profile/update-astrologer`, data),

  updatePassword: (data: UpdatePassword) =>
    axiosInstance.patch<ApiResponse>(`/profile/update-password`, data),
};
