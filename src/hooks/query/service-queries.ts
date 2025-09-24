import { useQuery } from '@tanstack/react-query';
import { serviceAPI } from '@/services/api/service-api';

export const useGetAllServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => serviceAPI.getAllServices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useGetServiceById = (id: string) => {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => serviceAPI.getServiceById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};