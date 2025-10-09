import adminAxios from '../admin-axios';
import { AxiosResponse } from 'axios';

export interface RadioShow {
  id: string;
  showTitle: string;
  hostName: string;
  date: string;
  time: string;
  link: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRadioShowData {
  showTitle: string;
  hostName: string;
  date: string;
  time: string;
  link: string;
  isActive?: boolean;
}

export interface UpdateRadioShowData {
  showTitle?: string;
  hostName?: string;
  date?: string;
  time?: string;
  link?: string;
  isActive?: boolean;
}

export interface RadioShowsResponse {
  message: string;
  status_code: number;
  data: {
    radioShows: RadioShow[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface RadioShowResponse {
  message: string;
  status_code: number;
  data: {
    radioShow: RadioShow;
  };
}

export interface RadioShowQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
}

// Public API endpoints
export const getRadioShows = async (params: RadioShowQueryParams = {}): Promise<AxiosResponse<RadioShowsResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);

  return adminAxios.get(`/radio-shows?${queryParams.toString()}`);
};

export const getRadioShowById = async (id: string): Promise<AxiosResponse<RadioShowResponse>> => {
  return adminAxios.get(`/radio-shows/${id}`);
};

// Admin API endpoints
export const getAdminRadioShows = async (params: RadioShowQueryParams = {}): Promise<AxiosResponse<RadioShowsResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status !== undefined) queryParams.append('status', params.status.toString());

  return adminAxios.get(`/admin/radio-shows?${queryParams.toString()}`);
};

export const getAdminRadioShowById = async (id: string): Promise<AxiosResponse<RadioShowResponse>> => {
  return adminAxios.get(`/admin/radio-shows/${id}`);
};

export const createRadioShow = async (data: CreateRadioShowData): Promise<AxiosResponse<RadioShowResponse>> => {
  return adminAxios.post('/admin/radio-shows', data);
};

export const updateRadioShow = async (id: string, data: UpdateRadioShowData): Promise<AxiosResponse<RadioShowResponse>> => {
  return adminAxios.put(`/admin/radio-shows/${id}`, data);
};

export const deleteRadioShow = async (id: string): Promise<AxiosResponse<{ message: string; status_code: number }>> => {
  return adminAxios.delete(`/admin/radio-shows/${id}`);
};

export const enableRadioShow = async (id: string): Promise<AxiosResponse<RadioShowResponse>> => {
  return adminAxios.patch(`/admin/radio-shows/${id}/enable`);
};

export const disableRadioShow = async (id: string): Promise<AxiosResponse<RadioShowResponse>> => {
  return adminAxios.patch(`/admin/radio-shows/${id}/disable`);
};