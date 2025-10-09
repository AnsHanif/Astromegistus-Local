import publicAxiosInstance from '../public-axios';

export type ContactFormData = {
  fullName: string;
  email: string;
  message: string;
  termsAndCondition: boolean;
};

export type NotifyMeFormData = {
  email: string;
};

export const contactAPI = {
  submitContactForm: (data: ContactFormData) =>
    publicAxiosInstance.post('/api/contact/submit', data),

  notifyMeForm: (data: NotifyMeFormData) =>
    publicAxiosInstance.post('/api/contact/notify-me', data),
};
