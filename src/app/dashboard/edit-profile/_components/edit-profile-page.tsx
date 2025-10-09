'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Label } from '@/components/ui/label';
import FormInput from '@/components/common/form-input';
import { CustomSelect } from '@/components/common/custom-select/custom-select';

import {
  GENDER_TYPE,
  PLACE_OF_BIRTH_OPTIONS,
} from '@/app/(auth)/signup/_components/signup.constant';
import TimeOfBirth from '@/app/(auth)/signup/_components/time-of-birth';
import DateOfBirthSelect from '@/app/(auth)/signup/_components/date-of-birth-select';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { useUpdateProfile } from '@/hooks/mutation/profile-mutation/profile';
import { EditProfileForm } from '@/hooks/mutation/profile-mutation/profile-service.type';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import FullScreenLoader from '@/components/common/full-screen-loader';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';

interface FormData {
  name: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  email: string;
  minute: string;
  timePeriod: string;
  gender: string;
  placeOfBirth: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const userInitRef = useRef<boolean | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    day: '',
    month: '',
    year: '',
    hour: '',
    email: '',
    minute: '',
    timePeriod: '',
    gender: '',
    placeOfBirth: '',
  });

  const methods = useForm<EditProfileForm>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  // 🔑 Sync form data when user is loaded
  useEffect(() => {
    if (user) {
      if (userInitRef.current) return;
      userInitRef.current = true;

      let dobDay = '';
      let dobMonth = '';
      let dobYear = '';

      // Fix: Add type guard for user and dateOfBirth property
      if (user && 'dateOfBirth' in user && user.dateOfBirth) {
        const dob = moment(user.dateOfBirth);

        dobDay = dob.format('D'); // → "6" (no leading zero)
        dobMonth = dob.format('MMMM'); // → "May"
        dobYear = dob.format('YYYY'); // → "2022"
      }

      const [hour, minutePeriod] = user.timeOfBirth?.split(':') ?? [];
      const [minute, period] = minutePeriod?.split(' ') ?? [];

      setFormData({
        name: user.name ?? '',
        day: dobDay ?? '',
        month: dobMonth ?? '',
        year: dobYear ?? '',
        hour: hour ?? '',
        minute: minute ?? '',
        email: user.email ?? '',
        timePeriod: period ?? '',
        gender: user.gender ?? '',
        placeOfBirth: user.placeOfBirth ?? '',
      });

      // preload RHF values
      methods.reset({
        name: user.name ?? '',
        email: user.email ?? '',
        gender: user.gender ?? '',
        placeOfBirth: user.placeOfBirth ?? '',
      });
    }
  }, [user, methods]);

  const handleFieldChange = useCallback(
    (
      field: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'timePeriod',
      value: string
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear errors for the specific field being changed
      if (field === 'day') methods.clearErrors('day');
      if (field === 'month') methods.clearErrors('month');
      if (field === 'year') methods.clearErrors('year');
      if (field === 'hour') methods.clearErrors('hour');
      if (field === 'minute') methods.clearErrors('minute');
      if (field === 'timePeriod') methods.clearErrors('timePeriod');
    },
    [methods]
  );

  const handleSelect = useCallback(
    (field: 'gender' | 'placeOfBirth', value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      methods.clearErrors(field);
    },
    [methods]
  );

  const onSubmit = async (data: EditProfileForm) => {
    // Backend expects individual date/time fields, not combined dateOfBirth/timeOfBirth
    const payload = {
      name: data.name,
      email: data.email,
      // Send individual date fields that backend expects
      day: formData.day || undefined,
      month: formData.month || undefined,
      year: formData.year || undefined,
      // Send individual time fields that backend expects
      hour: formData.hour || undefined,
      minute: formData.minute || undefined,
      timePeriod: formData.timePeriod || undefined,
      gender: formData.gender || undefined,
      placeOfBirth: formData.placeOfBirth || undefined,
    };

    console.log('Profile update payload:', payload);
    await updateProfile(payload);
    router.push('/dashboard/settings');
  };

  return (
    <FormProvider {...methods}>
      {/* {isLoading && <FullScreenLoader />} */}
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="!flex flex-col gap-6 md:gap-20 md:flex-row w-full h-full max-w-[1050px] justify-between py-3">
          <div className="w-full space-y-6 md:space-y-10">
            <FormInput
              label="Full Name"
              name="name"
              type="text"
              placeholder="Enter full name"
              rules={{
                required: 'Full name is required',
                validate: {
                  minLength: (value) =>
                    value.trim().length >= 3 ||
                    'Full name must be at least 3 characters long.',
                  alphabeticOnly: (value) =>
                    /^[a-zA-Z\s]+$/.test(value) ||
                    'Full name can only contain letters and spaces.',
                },
                maxLength: {
                  value: 100,
                  message: 'Full name must be at most 100 characters long.',
                },
              }}
              className="focus:ring-golden-glow"
            />

            <DateOfBirthSelect
              name="date"
              day={formData.day}
              month={formData.month}
              year={formData.year}
              onChange={handleFieldChange}
              className=" hover:border-golden-glow focus:border-golden-glow"
            />

            <div className="flex flex-col gap-4">
              <Label
                htmlFor="birthPlace"
                className="text-size-tertiary sm:text-size-medium font-semibold"
              >
                Place of Birth
              </Label>
              <CustomSelect
                onSelect={(value: string) =>
                  handleSelect('placeOfBirth', value)
                }
                options={PLACE_OF_BIRTH_OPTIONS}
                size="sm"
                variant="default"
                placeholder="Select country"
                selectedValue={formData.placeOfBirth}
                className="w-full h-12 sm:h-15"
                triggerClassName="h-12 sm:h-15 text-sm md:text-size-secondary w-full cursor-pointer bg-transparent border-grey hover:border-golden-glow focus:border-golden-glow"
                contentClassName="w-full max-h-60 overflow-y-auto"
              />
              {methods.formState.errors.placeOfBirth && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.placeOfBirth.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full space-y-6 md:space-y-10">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full focus:ring-golden-glow"
              disabled={true}
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

            <TimeOfBirth
              name="time"
              hour={formData.hour}
              minute={formData.minute}
              timePeriod={formData.timePeriod}
              onChange={handleFieldChange}
              className="hover:border-golden-glow focus:border-golden-glow"
            />

            <div className="flex flex-col items-start space-y-4">
              <Label
                htmlFor="gender"
                className="text-size-tertiary sm:text-size-medium font-semibold"
              >
                Gender
              </Label>

              <CustomSelect
                onSelect={(value: string) => handleSelect('gender', value)}
                options={GENDER_TYPE}
                size="sm"
                variant="default"
                placeholder="Select gender"
                selectedValue={formData.gender}
                className="w-full h-12 sm:h-15"
                triggerClassName="h-12 sm:h-15 text-sm md:text-size-secondary w-full cursor-pointer bg-transparent border-grey hover:border-golden-glow focus:border-golden-glow"
                contentClassName="w-full max-h-60 overflow-y-auto"
              />

              {methods.formState.errors.gender && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.gender.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="md:w-[485px] w-full text-black mt-4 md:mt-8"
        >
          {isPending ? <SpinnerLoader /> : 'Save Changes'}
        </Button>
      </form>
    </FormProvider>
  );
}
