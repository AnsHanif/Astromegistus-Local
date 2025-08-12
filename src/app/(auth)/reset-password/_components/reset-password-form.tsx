import React from 'react';
import AuthForm from '../../_components/auth-form';
import FormInput from '@/components/common/form-input';
import Link from '@/components/common/custom-link/custom-link';

import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

type Props = { onBack: () => void };

type ResetPasswordFormType = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordForm({ onBack }: Props) {
  const methods = useForm<ResetPasswordFormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const onSubmit = (data: ResetPasswordFormType) => {
    console.log('Form Submitted with:', data);
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
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />

          <Button variant="default" className="w-full text-black" type="submit">
            Reset Password
          </Button>
        </form>
      </FormProvider>
    </AuthForm>
  );
}
