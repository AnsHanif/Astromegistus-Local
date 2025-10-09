import { useQuery } from '@tanstack/react-query';
import { jobsAPI, JobQueryParams } from '@/services/api/jobs-api';

export const useJobs = (params?: JobQueryParams) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsAPI.getJobs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsAPI.getJobById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};