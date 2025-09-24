import { useMutation, useQuery } from '@tanstack/react-query';
import { pricingAPI } from '@/services/api/pricing-api';
import { InquiryForm } from '@/types/pricing-plans';
import { enqueueSnackbar } from 'notistack';

export const useGetPricingPlans = () => {
  return useQuery({
    queryKey: ['pricing-plans'],
    queryFn: async () => {
      const response = await pricingAPI.getPricingPlans();
      return response.data;
    },
    retry: false,
  });
};

export const useSubmitSupremeInquiry = () => {
  return useMutation({
    mutationFn: async (inquiryData: InquiryForm) => {
      const response = await pricingAPI.submitInquiry(inquiryData);
      return response.data;
    },
    onSuccess: () => {
      enqueueSnackbar(
        'Your inquiry has been submitted successfully. Our sales team will contact you shortly.',
        {
          variant: 'success',
        }
      );
    },
  });
};
