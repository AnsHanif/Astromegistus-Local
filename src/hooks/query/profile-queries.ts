import { useQuery } from '@tanstack/react-query';
import { profileAPI } from '@/services/api/profile-api';

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => profileAPI.getUserProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};