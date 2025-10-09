export type EditProfileForm = {
  name: string;
  email: string;
  day?: string;
  month?: string;
  year?: string;
  hour?: string;
  minute?: string;
  timePeriod?: string;
  gender?: string;
  placeOfBirth?: string;
};

export type UpdatePassword = {
  currentPassword: string;
  newPassword: string;
};

export type UpdateAstrologerProfile = {
  name: string;
  email: string;
  timeZone?: string;
};

export type UpdateProfilePicture = {
  profilePictureKey: string;
};

export type AstrologerProfileResponse = {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
  role: string;
  astrologerType: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
  role: string;
  astrologerType: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  timeOfBirth: string | null;
  createdAt: string;
  updatedAt: string;
  timeZone?: string;
  astrologyCategories?: string[];
  coachingCategories?: string[];
};

export type UpdateCategories = {
  astrologyCategories?: string[];
  coachingCategories?: string[];
};

export type CancelSubscriptionForm = {
  subscriptionId: string;
};

export type StripeChangePlanForm = {
  planId: string;
};
