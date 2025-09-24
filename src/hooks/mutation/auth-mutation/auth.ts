import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services/api/auth-api';
import {
  ForgotPassword,
  LoginUser,
  ResendCode,
  ResetPassword,
  SignUpUser,
  VerifyEmail,
} from './auth-service.type';

export const useSignUpUser = () => {
  return useMutation({
    mutationFn: async (data: SignUpUser) => {
      const response = await authAPI.signUpUser(data);
      return response.data;
    },
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: async (data: LoginUser) => {
      const response = await authAPI.loginUser(data);
      return response.data;
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPassword) => {
      const response = await authAPI.forgotPassword(data);
      return response.data;
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (data: VerifyEmail) => {
      const response = await authAPI.verifyEmail(data);
      return response.data;
    },
  });
};

export const useResendCode = () => {
  return useMutation({
    mutationFn: async (data: ResendCode) => {
      const response = await authAPI.resendCode(data);
      return response.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPassword) => {
      const response = await authAPI.resetPassword(data);
      return response.data;
    },
  });
};
