import { InquiryForm } from '@/types/pricing-plans';
import axiosInstance from '../axios';

export const pricingAPI = {
  getPricingPlans: () => axiosInstance.get('/pricing-plan/fetch'),

  submitInquiry: (data: InquiryForm) =>
    axiosInstance.post(`/pricing-plan/supreme/submit`, data),
};
