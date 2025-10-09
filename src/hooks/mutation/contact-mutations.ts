import { useMutation } from '@tanstack/react-query';
import {
  contactAPI,
  ContactFormData,
  NotifyMeFormData,
} from '@/services/api/contact-api';

export const useSubmitContactForm = () => {
  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await contactAPI.submitContactForm(data);
      return response.data;
    },
  });
};

export const useNotifyMeForm = () => {
  return useMutation({
    mutationFn: async (data: NotifyMeFormData) => {
      const response = await contactAPI.notifyMeForm(data);
      return response.data;
    },
  });
};
