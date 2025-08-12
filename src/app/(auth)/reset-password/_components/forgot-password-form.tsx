import React from 'react';
import AuthForm from '../../_components/auth-form';
import FormInput from '@/components/common/form-input';
import Link from '@/components/common/custom-link/custom-link';

import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

type Props = { onSuccess: () => void };

type ForgotPasswordForm = { email: string };

export default function ForgotPasswordForm({ onSuccess }: Props) {
  const methods = useForm<ForgotPasswordForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    console.log('Form Submitted with:', data);
    onSuccess();
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
          />

          <div>
            <Button
              variant="default"
              className="w-full text-black"
              type="submit"
            >
              Send OTP
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
