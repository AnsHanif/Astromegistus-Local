'use client';

import React from 'react';
import AuthForm from '../../_components/auth-form';
import FormInput from '@/components/common/form-input';
import Link from '@/components/common/custom-link/custom-link';

import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const methods = useForm<LoginForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const onSubmit = (data: LoginForm) => {
    console.log('Form Submitted with:', data);
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
          />

          <FormInput
            label="Password:"
            name="password"
            type="password"
            placeholder="Password"
          />

          <div className="text-right text-sm text-golden-yellow font-medium">
            <Link href="/forgot-password" className="hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button variant="default" className="w-full text-black" type="submit">
            Log In
          </Button>

          <div className="text-center">
            Dont't have an account?{' '}
            <Link href="/signup" className="text-golden-yellow hover:underline">
              Sign Up
            </Link>
          </div>
        </form>
      </FormProvider>
    </AuthForm>
  );
};

export default LoginPage;
