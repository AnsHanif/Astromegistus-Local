import axiosInstance from '../axios';
import { StripeSubscription } from '@/hooks/mutation/order-summary-mutation/order-summary-service.type';

export const orderSummaryAPI = {
  stripeSubscription: (data: StripeSubscription) =>
    axiosInstance.post(`/payment/stripe/subscribe`, data, {
      headers: { Authorization: `Bearer ${data.token}` },
    }),
};
