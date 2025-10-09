import axiosInstance from '../axios';

// User API types (same as admin but for public use)
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'GUEST' | 'PAID' | 'ASTROMEGISTUS' | 'ASTROMEGISTUS_COACH' | 'ADMIN';
  astrologerType?: 'COACHING';
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  timeZone?: string;
  profilePic?: string;
  profilePictureKey?: string | null;
  verified: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

type Availability = {
  id: string;
  userId: string;
  date: string;
  time: string;
  duration: number;
  preparationTime: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse {
  message: string;
  status_code: number;
  data: {
    users: User[];
    pagination: Pagination;
  };
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: 'GUEST' | 'PAID' | 'ASTROMEGISTUS' | 'ASTROMEGISTUS_COACH' | 'ADMIN';
  status?: boolean;
  search?: string;
  name?: string;
  type?: 'COACHING';
  productId?: string;
}

export interface TimeSlotsResponse {
  message: string;
  status_code: number;
  data: Availability[];
}

// User API functions (public access)
export const userAPI = {
  // Get users (public access - only shows active and verified users)
  getUsers: (params?: UserQueryParams) =>
    axiosInstance.get<UsersResponse>('/users', { params }),

  // Astrologer specific endpoints
  getAstrologers: (
    role: 'ASTROMEGISTUS' | 'ASTROMEGISTUS_COACH',
    params?: Omit<UserQueryParams, 'role'>
  ) =>
    axiosInstance.get<UsersResponse>('/users', {
      params: { ...params, role, status: true },
    }),

  // Time Slots API
  getTimeSlots: (astrologerId: string, date: string) =>
    axiosInstance.get<TimeSlotsResponse>(
      `/timeslots/user/${astrologerId}/date/${date}`
    ),
};
