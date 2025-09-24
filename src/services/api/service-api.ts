import axiosInstance from '../axios';

export interface Service {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'ASTROLOGY_READING' | 'COACHING_SESSION';
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  title: string;
  description?: string;
  category: 'ASTROLOGY_READING' | 'COACHING_SESSION';
}

export interface UpdateServiceRequest {
  title?: string;
  description?: string;
  category?: 'ASTROLOGY_READING' | 'COACHING_SESSION';
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
}

export const serviceAPI = {
  getAllServices: () =>
    axiosInstance.get<Service[]>('/services'),

  getServiceById: (id: string) =>
    axiosInstance.get<Service>(`/services/${id}`),

  createService: (data: CreateServiceRequest) =>
    axiosInstance.post<Service>('/services', data),

  updateService: (id: string, data: UpdateServiceRequest) =>
    axiosInstance.put<Service>(`/services/${id}`, data),

  deleteService: (id: string) =>
    axiosInstance.delete<{ message: string }>(`/services/${id}`),
};