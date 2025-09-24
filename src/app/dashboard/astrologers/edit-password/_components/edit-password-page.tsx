'use client';
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/common/form-input';
import { FormProvider, useForm } from 'react-hook-form';
import { useUpdatePassword } from '@/hooks/mutation/profile-mutation/profile';
import FullScreenLoader from '@/components/common/full-screen-loader';
import { UpdatePassword } from '@/hooks/mutation/profile-mutation/profile-service.type';

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
    router.back()
  };
  
  const onSubmit = async (data: UpdatePassword) => {
    try {
      await updatePasswordMutation.mutateAsync(data);
      handleBack();
    } catch {
      // Error handling is done in the mutation hook
    }
  };

  return (
    <>
      <FullScreenLoader loading={updatePasswordMutation.isPending} />
      <FormProvider {...methods}>
      <div className="min-h-screen bg-black text-white">
        <div className="w-full p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <ChevronLeft 
              className="w-5 h-5 cursor-pointer hover:bg-gray-700 rounded p-1"
              onClick={handleBack}
            />
            <div>
              <h1 className="text-xl font-bold">Edit Password</h1>
              <p className="text-gray-400 text-xs">Customize your experience and preferences</p>
            </div>
          </div>

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