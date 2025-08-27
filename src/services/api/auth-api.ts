import {
  ForgotPassword,
  LoginUser,
  ResendCode,
  ResetPassword,
  SignUpUser,
  VerifyEmail,
} from '@/hooks/mutation/auth-muatation/auth-service.type';
import axiosInstance from '../axios';

export const authAPI = {
  signUpUser: (data: SignUpUser) => axiosInstance.post(`/auth/signup`, data),

  loginUser: (data: LoginUser) => axiosInstance.post(`/auth/login`, data),

  forgotPassword: (data: ForgotPassword) =>
    axiosInstance.post(`/auth/forgot-password`, data),

  verifyEmail: (data: VerifyEmail) =>
    axiosInstance.post(`/auth/verify-email`, data, {
      headers: { Authorization: `Bearer ${data.token}` },
    }),

  resendCode: (data: ResendCode) =>
    axiosInstance.get(`/auth/resend-code`, {
      headers: { Authorization: `Bearer ${data.token}` },
    }),

  resetPassword: (data: ResetPassword) => {
    return axiosInstance.put(`/auth/reset-password`, data, {
      headers: { Authorization: `Bearer ${data.token}` },
    });
  },
};
