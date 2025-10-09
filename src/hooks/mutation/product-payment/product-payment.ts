import { useMutation } from '@tanstack/react-query';
import { StripeProductPayment } from './product-payment-service';
import { productPaymentAPI } from '@/services/api/product-payment-api';

export const useStripeProductPayment = () => {
  return useMutation({
    mutationFn: async (data: StripeProductPayment) => {
      const response = await productPaymentAPI.stripeProductPayment(data);
      return response.data;
    },
  });
};
