import { s3ImageAPI } from '@/services/api/s3-image-api';
import { useQuery } from '@tanstack/react-query';

export const useGetIntroVideos = () => {
  return useQuery({
    queryKey: ['intro-videos'],
    queryFn: async () => {
      const response = await s3ImageAPI.getIntroVideos();
      return response.data.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};
