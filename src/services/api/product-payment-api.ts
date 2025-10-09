import { StripeProductPayment } from '@/hooks/mutation/product-payment/product-payment-service';
import axiosInstance from '../axios';

export const productPaymentAPI = {
  stripeProductPayment: (data: StripeProductPayment) =>
    axiosInstance.post(`/payment/product/stripe`, data),
};
