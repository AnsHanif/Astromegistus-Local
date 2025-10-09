'use client';
import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import FormInput from '@/components/common/form-input';
import { FormProvider, useForm } from 'react-hook-form';
import { useUpdatePassword } from '@/hooks/mutation/profile-mutation/profile';
import { UpdatePassword } from '@/hooks/mutation/profile-mutation/profile-service.type';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import FullScreenLoader from '@/components/common/full-screen-loader';

const EditPasswordPage = () => {
  const router = useRouter();
  const updatePasswordMutation = useUpdatePassword();
  
  const methods = useForm<UpdatePassword>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: ''
    }
  });
  
  const handleBack = () => {
    router.push('/dashboard/settings');
  };
  
  const onSubmit = async (data: UpdatePassword) => {
    try {
      await updatePasswordMutation.mutateAsync(data);
      methods.reset();
      handleBack();
    } catch {
      // Error handling is done in the mutation hook
    }
  };

  return (
    <>
      <FullScreenLoader loading={updatePasswordMutation.isPending} />
      <FormProvider {...methods}>
        <div className="min-h-screen">
        <div className="w-full p-6">
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Password Form */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  rules={{
                    required: 'Current password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long.',
                    },
                  }}
                  className="focus:ring-golden-glow border"
                />

                <FormInput
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  rules={{
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long.',
                    },
                    validate: (value) => {
                      const currentPassword = methods.getValues('currentPassword');
                      return value !== currentPassword || 'New password must be different from current password';
                    }
                  }}
                  className="focus:ring-golden-glow border"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-start">
              <Button
                type="submit"
                disabled={updatePasswordMutation.isPending}
                className="px-6 py-3 text-black text-sm font-semibold bg-gradient-to-r from-golden-glow via-pink-shade to-bronze w-auto h-auto disabled:opacity-50"
              >
                {updatePasswordMutation.isPending ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
        </div>
      </FormProvider>
    </>
  );
};

export default EditPasswordPage;