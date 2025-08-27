'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormInput from '@/components/common/form-input';
import { Button } from '@/components/ui/button';

type EditPasswordForm = {
  currentPassword: string;
  newPassword: string;
};

export default function EditPasswordPage() {
  const methods = useForm<EditPasswordForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  return (
    <FormProvider {...methods}>
      <form className="!flex flex-col gap-6 md:gap-20 md:flex-row w-full h-full max-w-[1050px] justify-between py-3">
        <div className="w-full">
          <FormInput
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="Current Password"
            rules={{
              required: 'Current Password is required',
              minLength: {
                value: 8,
                message: 'Current Password must be at least 8 characters long.',
              },
              maxLength: {
                value: 100,
                message:
                  'Current Password must be at most 100 characters long.',
              },
            }}
            className="focus:ring-golden-glow"
          />
        </div>

        <div className="w-full">
          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="New Password"
            rules={{
              required: 'New Password is required',
              minLength: {
                value: 8,
                message: 'New Password must be at least 8 characters long.',
              },
              maxLength: {
                value: 100,
                message: 'New Password must be at most 100 characters long.',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                message:
                  'New Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
              },
            }}
            className="focus:ring-golden-glow"
          />
        </div>
      </form>

      <Button className="md:w-[485px] w-full text-black mt-4 md:mt-8">
        Save Changes
      </Button>
    </FormProvider>
  );
}
