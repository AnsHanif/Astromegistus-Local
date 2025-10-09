import {
  EditProfileForm,
  UpdatePassword,
  UpdateAstrologerProfile,
  UpdateProfilePicture,
  AstrologerProfileResponse,
  ApiResponse,
  UserProfile,
  CancelSubscriptionForm,
  StripeChangePlanForm,
  UpdateCategories,
} from '@/hooks/mutation/profile-mutation/profile-service.type';
import axiosInstance from '../axios';

export const profileAPI = {
  getUserProfile: () => axiosInstance.get<ApiResponse<UserProfile>>(`/profile`),

  updateProfile: (data: EditProfileForm) =>
    axiosInstance.patch<ApiResponse>(`/profile/update`, data),

  updateAstrologerProfile: (data: UpdateAstrologerProfile) =>
    axiosInstance.patch<ApiResponse<AstrologerProfileResponse>>(
      `/profile/update-astrologer`,
      data
    ),

  updatePassword: (data: UpdatePassword) =>
    axiosInstance.patch<ApiResponse>(`/profile/update-password`, data),

  updateProfilePicture: (data: UpdateProfilePicture) =>
    axiosInstance.patch<ApiResponse>(`/profile/update-picture`, data),

  updateTimezone: (timeZone: string) =>
    axiosInstance.patch<ApiResponse>(`/profile/update-timezone`, { timeZone }),

  updateCategories: (data: UpdateCategories) =>
    axiosInstance.patch<ApiResponse<UserProfile>>(`/profile/update-categories`, data),

  cancelSubscription: (data: CancelSubscriptionForm) =>
    axiosInstance.post(`/profile/cancel-subscription`, data),

  stripeChangePlan: (data: StripeChangePlanForm) =>
    axiosInstance.put(`/payment/stripe/change-plan`, data),
};
