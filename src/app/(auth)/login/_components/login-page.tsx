'use client';

import React from 'react';
import AuthForm from '../../_components/auth-form';
import FormInput from '@/components/common/form-input';
import Link from '@/components/common/custom-link/custom-link';

import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useLoginUser } from '@/hooks/mutation/auth-mutation/auth';
import { useSnackbar } from 'notistack';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '@/store/slices/user-slice';
import { useQueryClient } from '@tanstack/react-query';

type LoginForm = {
  email: string;
  password: string;
};

type LoginPageProps = { onSuccess: () => void };

const LoginPage = ({ onSuccess }: LoginPageProps) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const dispatch = useDispatch();

  const methods = useForm<LoginForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { mutate, isPending } = useLoginUser();

  const onSubmit = (data: LoginForm) => {
    mutate(data, {
      onSuccess: (response: any) => {
        if (response?.data?.token && response?.data?.user) {
          const { user, token } = response.data;

          if (user.role === 'ADMIN') {
            closeSnackbar();
            enqueueSnackbar(
              'Access denied: Admins must log in through the admin portal.',
              {
                variant: 'error',
              }
            );
            return;
          }

          let resolvedRole: string = 'GUEST';

          if (user.role === 'PAID') {
            if (
              Array.isArray(user.subscriptions) &&
              user.subscriptions.length > 0
            ) {
              const planName = user.subscriptions[0]?.plan?.name;
              if (planName === 'CLASSIC') resolvedRole = 'CLASSIC';
              if (planName === 'PREMIER') resolvedRole = 'PREMIER';
            } else {
              resolvedRole = 'GUEST';
            }
          } else if (
            user.role === 'ASTROMEGISTUS' ||
            user.role === 'ASTROMEGISTUS_COACH'
          ) {
            resolvedRole = user.role;
          } else if (user.role === 'GUEST') {
            resolvedRole = 'GUEST';
          } else {
            enqueueSnackbar('Invalid role detected. Please contact support.', {
              variant: 'error',
            });
            return;
          }

          // remove cart items and cache products
          localStorage.removeItem('cart');
          localStorage.removeItem('final-cart');
          queryClient.clear();

          localStorage.setItem('role', resolvedRole);
          Cookies.set('astro-tk', token);
          dispatch(setCurrentUser({ user, token }));

          closeSnackbar();
          enqueueSnackbar(response?.message, { variant: 'success' });

          if (
            resolvedRole === 'ASTROMEGISTUS' ||
            resolvedRole === 'ASTROMEGISTUS_COACH'
          ) {
            router.push('/dashboard/astrologers');
          } else {
            router.push('/dashboard/booked-readings');
          }
        }
      },
      onError: (error: any) => {
        console.log(error);
        let message = 'Something went wrong. Please try again.';
        if (error?.response?.data?.message) {
          message = error.response.data.message;
        } else if (error?.message) {
          message = error.message;
        }

        if (
          error?.response?.data?.status_code === 403 &&
          error?.response?.data?.data?.token
        ) {
          Cookies.set('temp-tk-astro', error?.response?.data?.data?.token);
          onSuccess();
        }

        if (
          error?.response?.data?.status_code === 402 &&
          error?.response?.data?.data?.token
        ) {
          Cookies.set('temp-nutk-astro', error?.response?.data?.data?.token);
          router.push('/pricing-plans');
        }

        closeSnackbar();
        enqueueSnackbar(message, { variant: 'error' });
      },
    });
  };

  return (
    <AuthForm
      heading="Welcome Back to astromegistus"
      subheading="Explore your stars with clarity"
      buttonText="we are testing"
    >
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-4 w-full h-full max-w-[500px]"
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

          <FormInput
            label="Password:"
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

          <div className="text-right text-sm text-golden-yellow font-medium">
            <Link href="/reset-password" className="hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            variant="default"
            className="w-full text-black"
            type="submit"
            disabled={isPending}
          >
            {isPending ? <SpinnerLoader /> : 'Log In'}
          </Button>

          <div className="text-center">
            Dont't have an account?{' '}
            <Link
              href="/auth-selection"
              className="text-golden-yellow hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </FormProvider>
    </AuthForm>
  );
};

export default LoginPage;
