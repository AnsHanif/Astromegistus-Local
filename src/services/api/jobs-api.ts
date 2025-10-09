import axiosInstance from '../axios';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: 'freelance' | 'employment';
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobQueryParams {
  page?: number;
  limit?: number;
  category?: 'freelance' | 'employment' | 'all';
}

export interface JobsResponse {
  message: string;
  status_code: number;
  data: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    jobs: Job[];
  };
}

export const jobsAPI = {
  getJobs: (params?: JobQueryParams) =>
    axiosInstance.get<JobsResponse>('/jobs', { params }),

  getJobById: (id: string) =>
    axiosInstance.get<{ data: { job: Job } }>(`/jobs/${id}`),
};