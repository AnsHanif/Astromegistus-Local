import React from 'react';
import AuthForm from '../../_components/auth-form';
import FormInput from '@/components/common/form-input';
import Link from '@/components/common/custom-link/custom-link';

import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useSnackbar } from 'notistack';
import { useResetPassword } from '@/hooks/mutation/auth-muatation/auth';
import Cookies from 'js-cookie';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { useRouter } from 'next/navigation';

type Props = { onBack: () => void };

type ResetPasswordFormType = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm({ onBack }: Props) {
  const router = useRouter();
  const token = Cookies.get('temp-tk-astro-np') ?? '';
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const methods = useForm<ResetPasswordFormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { mutate, isPending } = useResetPassword();

  const onSubmit = (data: ResetPasswordFormType) => {
    const formData = { token, password: data?.password };
    mutate(formData, {
      onSuccess: (response: any) => {
        Cookies.remove('temp-tk-astro-np');
        closeSnackbar();
        enqueueSnackbar(response?.message, { variant: 'success' });
        router.push('/login');
      },
      onError: (error: any) => {
        console.log(error);
        let message = 'Something went wrong. Please try again.';
        if (error?.response?.data?.message) {
          message = error.response.data.message;
        } else if (error?.message) {
          message = error.message;
        }
        closeSnackbar();
        enqueueSnackbar(message, { variant: 'error' });
      },
    });
  };
  return (
    <AuthForm
      heading="Set New Password"
      subheading="Create a new password for your account"
      buttonText=""
      showBackButton={true}
      onBackClick={onBack}
    >
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-8 w-full h-full max-w-[500px]"
          onSubmit={methods.handleSubmit(onSubmit)} // 👈 Hooked up here
        >
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long.',
              },
              maxLength: {
                value: 100,
                message: 'Password must be at most 100 characters long.',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                message:
                  'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
              },
            }}
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            rules={{
              required: 'Confirm password is required',
              validate: (value, formValues) => {
                return (
                  value === formValues.password || 'Passwords do not match'
                );
              },
            }}
          />

          <Button
            variant="default"
            className="w-full text-black"
            type="submit"
            disabled={isPending}
          >
            {isPending ? <SpinnerLoader /> : 'Reset Password'}
          </Button>
        </form>
      </FormProvider>
    </AuthForm>
  );
}
