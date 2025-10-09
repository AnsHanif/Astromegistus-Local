import publicAxiosInstance from '../public-axios';
import adminAxiosInstance from '../admin-axios';
import {
  CoachingSession,
  CreateCoachingSessionRequest,
  CreateCoachingSessionWithImageRequest,
  UpdateCoachingSessionRequest,
  UpdateCoachingSessionWithImageRequest,
  CoachingQueryParams,
} from '@/types/coaching';
import axiosInstance from '../axios';

// Public Coaching API (for users) - Updated to match product API pattern
export const coachingAPI = {
  getAllCoachingSessions: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    productType?: string;
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
  }) => {
    const response = await axiosInstance.get('/coaching/sessions', {
      params,
    });
    return response;
  },

  getSingleCoachingSession: async (id: string) => {
    const response = await axiosInstance.get(`/coaching/sessions/${id}`);
    return response;
  },

  // Get coaching sections
  getCoachingSections: async (coachingId: string) => {
    const response = await axiosInstance.get(
      `/coaching/sessions/${coachingId}/sections`
    );
    return response;
  },

  // Get astrologer for coaching session (auto-assign)
  getAstrologerForSession: async (sessionId: string) => {
    const response = await axiosInstance.post(`/coaching/coaches/random`, {
      sessionId,
    });

    return response.data?.data;
  },
};

// Legacy API (keeping for backward compatibility)
export const publicCoachingAPI = {
  // Get all active coaching sessions
  getCoachingSessions: (params?: CoachingQueryParams) =>
    publicAxiosInstance.get<CoachingSession[]>('/coaching/sessions', {
      params,
    }),

  // Get single coaching session
  getCoachingSessionById: (id: string) =>
    publicAxiosInstance.get<CoachingSession>(`/coaching/sessions/${id}`),
};

// Admin Coaching API (for admin management)
export const adminCoachingAPI = {
  // Get all coaching sessions (admin)
  getCoachingSessions: (params?: CoachingQueryParams) =>
    adminAxiosInstance.get<CoachingSession[]>('/admin/coaching/sessions', {
      params,
    }),

  // Get single coaching session (admin)
  getCoachingSessionById: (id: string) =>
    adminAxiosInstance.get<CoachingSession>(`/admin/coaching/sessions/${id}`),

  // Create coaching session
  createCoachingSession: (data: CreateCoachingSessionRequest) =>
    adminAxiosInstance.post<CoachingSession>('/admin/coaching/sessions', data),

  // Create coaching session with image
  createCoachingSessionWithImage: (
    data: CreateCoachingSessionWithImageRequest
  ) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('shortDescription', data.shortDescription);
    formData.append('duration', data.duration);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('isActive', data.isActive.toString());
    formData.append('features', JSON.stringify(data.features));
    formData.append('packages', JSON.stringify(data.packages));
    formData.append('image', data.image);

    return adminAxiosInstance.post<CoachingSession>(
      '/admin/coaching/sessions',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  // Update coaching session
  updateCoachingSession: (id: string, data: UpdateCoachingSessionRequest) =>
    adminAxiosInstance.put<CoachingSession>(
      `/admin/coaching/sessions/${id}`,
      data
    ),

  // Update coaching session with image
  updateCoachingSessionWithImage: (
    id: string,
    data: UpdateCoachingSessionWithImageRequest
  ) => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.shortDescription)
      formData.append('shortDescription', data.shortDescription);
    if (data.duration) formData.append('duration', data.duration);
    if (data.price !== undefined)
      formData.append('price', data.price.toString());
    if (data.category) formData.append('category', data.category);
    if (data.isActive !== undefined)
      formData.append('isActive', data.isActive.toString());
    if (data.features)
      formData.append('features', JSON.stringify(data.features));
    if (data.packages)
      formData.append('packages', JSON.stringify(data.packages));
    formData.append('image', data.image);

    return adminAxiosInstance.put<CoachingSession>(
      `/admin/coaching/sessions/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  // Delete coaching session
  deleteCoachingSession: (id: string) =>
    adminAxiosInstance.delete(`/admin/coaching/sessions/${id}`),

  // Enable coaching session
  enableCoachingSession: (id: string) =>
    adminAxiosInstance.patch<CoachingSession>(
      `/admin/coaching/sessions/${id}/enable`
    ),

  // Disable coaching session
  disableCoachingSession: (id: string) =>
    adminAxiosInstance.patch<CoachingSession>(
      `/admin/coaching/sessions/${id}/disable`
    ),

  // Coaching Sections API
  getCoachingSections: (coachingId: string) => {
    return adminAxiosInstance.get(
      `/admin/coaching/sessions/${coachingId}/sections`
    );
  },

  updateCoachingSections: (
    coachingId: string,
    sections: {
      keyBenefits?: Array<{
        title: string;
        description?: string;
        order: number;
      }>;
      whatYouWillLearn?: Array<{
        title: string;
        description?: string;
        order: number;
      }>;
      whatsIncluded?: Array<{
        title: string;
        description?: string;
        order: number;
      }>;
    }
  ) => {
    return adminAxiosInstance.put(
      `/admin/coaching/sessions/${coachingId}/sections`,
      sections
    );
  },

  // Booking functionality removed for now
};
