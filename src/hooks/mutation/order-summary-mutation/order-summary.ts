import { useMutation } from '@tanstack/react-query';
import { orderSummaryAPI } from '@/services/api/order-summary-api';
import { StripeSubscription } from './order-summary-service.type';

export const useStripeSubscription = () => {
  return useMutation({
    mutationFn: async (data: StripeSubscription) => {
      const response = await orderSummaryAPI.stripeSubscription(data);
      return response.data;
    },
  });
};
