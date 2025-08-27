import React from 'react';
import AuthForm from '../../_components/auth-form';
import FormInput from '@/components/common/form-input';
import Link from '@/components/common/custom-link/custom-link';

import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useSnackbar } from 'notistack';
import { useForgotPassword } from '@/hooks/mutation/auth-muatation/auth';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import Cookies from 'js-cookie';

type Props = { onSuccess: () => void };

type ForgotPasswordForm = { email: string };

export default function ForgotPasswordForm({ onSuccess }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const methods = useForm<ForgotPasswordForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { mutate, isPending } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordForm) => {
    mutate(data, {
      onSuccess: (response: any) => {
        Cookies.set('temp-tk-astro', response?.data?.token);
        onSuccess();
        closeSnackbar();
        enqueueSnackbar(response?.message, { variant: 'success' });
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
      heading="Forgot Your Password"
      subheading="Enter your email address to receive a password  reset link."
      buttonText=""
    >
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-8 w-full h-full max-w-[500px]"
          onSubmit={methods.handleSubmit(onSubmit)} // 👈 Hooked up here
        >
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Business Email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
              maxLength: {
                value: 254,
                message: 'Email must be at most 254 characters long.',
              },
            }}
          />

          <div>
            <Button
              variant="default"
              className="w-full text-black"
              type="submit"
              disabled={isPending}
            >
              {isPending ? <SpinnerLoader /> : 'Send OTP'}
            </Button>

            <div className="text-center mt-3">
              Remember Your Password?{' '}
              <Link
                href="/login"
                className="text-golden-yellow hover:underline"
              >
                Log In
              </Link>
            </div>
          </div>
        </form>
      </FormProvider>
    </AuthForm>
  );
}
