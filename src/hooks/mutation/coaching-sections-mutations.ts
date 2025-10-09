'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { coachingAPI, adminCoachingAPI } from '@/services/api/coaching-api';

interface CoachingSection {
  id?: string;
  title: string;
  description?: string;
  order: number;
}

interface CoachingSections {
  keyBenefits: CoachingSection[];
  whatYouWillLearn: CoachingSection[];
  whatsIncluded: CoachingSection[];
}

// API functions using centralized coaching API
const updateCoachingSections = async (coachingId: string, sections: CoachingSections): Promise<CoachingSections> => {
  // Transform data to match API expectations
  const apiData = {
    keyBenefits: sections.keyBenefits.map(item => ({
      title: item.title,
      description: item.description,
      order: item.order
    })),
    whatYouWillLearn: sections.whatYouWillLearn.map(item => ({
      title: item.title,
      description: item.description,
      order: item.order
    })),
    whatsIncluded: sections.whatsIncluded.map(item => ({
      title: item.title,
      description: item.description,
      order: item.order
    }))
  };

  const response = await adminCoachingAPI.updateCoachingSections(coachingId, apiData);
  return response.data?.data || response.data;
};

// Admin version for admin panel
const getAdminCoachingSections = async (coachingId: string): Promise<CoachingSections> => {
  try {
    const response = await adminCoachingAPI.getCoachingSections(coachingId);
    const data = response.data?.data || response.data;

    // Transform backend data to frontend format
    return {
      keyBenefits: data.keyBenefits || [],
      whatYouWillLearn: data.whatYouWillLearn || [],
      whatsIncluded: data.whatsIncluded || [],
    };
  } catch (error) {
    throw error;
  }
};

// Public version for coaching detail page
const getCoachingSections = async (coachingId: string): Promise<CoachingSections> => {
  const response = await coachingAPI.getCoachingSections(coachingId);
  const data = response.data?.data || response.data;

  // Transform backend data to frontend format
  return {
    keyBenefits: data.keyBenefits || [],
    whatYouWillLearn: data.whatYouWillLearn || [],
    whatsIncluded: data.whatsIncluded || [],
  };
};

export const useUpdateCoachingSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ coachingId, sections }: { coachingId: string; sections: CoachingSections }) =>
      updateCoachingSections(coachingId, sections),
    onSuccess: (data, variables) => {
      enqueueSnackbar('Coaching sections updated successfully!', {
        variant: 'success',
      });
      // Invalidate the admin coaching sections query to refetch data
      queryClient.invalidateQueries({ queryKey: ['admin-coaching-sections', variables.coachingId] });
      queryClient.invalidateQueries({ queryKey: ['coaching-sections', variables.coachingId] });
      queryClient.invalidateQueries({ queryKey: ['coaching'] });
    },
    onError: (error: any) => {
      console.error('Error updating coaching sections:', error);
      enqueueSnackbar(
        error?.message || 'Failed to update coaching sections',
        { variant: 'error' }
      );
    },
  });
};

// Hook for admin panel (requires admin auth)
export const useGetAdminCoachingSections = (coachingId: string) => {
  return useQuery({
    queryKey: ['admin-coaching-sections', coachingId],
    queryFn: () => getAdminCoachingSections(coachingId),
    enabled: !!coachingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in React Query v5)
  });
};

// Hook for public coaching detail page (no auth required)
export const useGetCoachingSections = (coachingId: string) => {
  return useQuery({
    queryKey: ['coaching-sections', coachingId],
    queryFn: () => getCoachingSections(coachingId),
    enabled: !!coachingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in React Query v5)
  });
};