'use client';
import React, { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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

type EditProfileForm = {
  fullName: string;
  email: string;
  day?: string;
  month?: string;
  year?: string;
  hour?: string;
  minute?: string;
  timePeriod?: string;
  gender?: string;
  birthCountry?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
};

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    day: '',
    month: '',
    year: '',
    hour: '',
    minute: '',
    timePeriod: '',
    gender: '',
    birthCountry: '',
  });

  const methods = useForm<EditProfileForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const handleFieldChange = useCallback(
    (
      field: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'timePeriod',
      value: string
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (field === 'day' || field === 'month' || field === 'year') {
        methods.clearErrors('dateOfBirth');
      }

      if (field === 'hour' || field === 'minute' || field === 'timePeriod') {
        methods.clearErrors('timeOfBirth');
      }
    },
    [methods]
  );

  const handleSelect = useCallback(
    (field: 'gender' | 'birthCountry', value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      methods.clearErrors(field);
    },
    [methods]
  );

  return (
    <FormProvider {...methods}>
      <form className="!flex flex-col gap-6 md:gap-20 md:flex-row w-full h-full max-w-[1050px] justify-between py-3">
        <div className="w-full space-y-6 md:space-y-10">
          <FormInput
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="Enter full name"
            rules={{
              required: 'Full name is required',
              validate: (value) =>
                value.trim().length >= 3 ||
                'Full name must be at least 3 characters long.',
              maxLength: {
                value: 100,
                message: 'Full name must be at most 100 characters long.',
              },
            }}
            className="focus:ring-golden-glow"
          />

          <DateOfBirthSelect
            name="dateOfBirth"
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
              Place of birth
            </Label>
            <CustomSelect
              onSelect={(value: string) => handleSelect('birthCountry', value)}
              options={PLACE_OF_BIRTH_OPTIONS}
              size="sm"
              variant="default"
              placeholder="Select country"
              selectedValue={formData.birthCountry}
              className="w-full h-12 sm:h-15"
              triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent border-grey hover:border-golden-glow focus:border-golden-glow"
              contentClassName="w-full max-h-60 overflow-y-auto"
            />
            {methods.formState.errors.birthCountry && (
              <p className="text-red-500 text-sm">
                {methods.formState.errors.birthCountry.message}
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
            name="timeOfBirth"
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
              triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent border-grey hover:border-golden-glow focus:border-golden-glow"
              contentClassName="w-full max-h-60 overflow-y-auto"
            />

            {methods.formState.errors.gender && (
              <p className="text-red-500 text-sm">
                {methods.formState.errors.gender.message}
              </p>
            )}
          </div>
        </div>
      </form>

      <Button className="md:w-[485px] w-full text-black mt-4 md:mt-8">
        Save Changes
      </Button>
    </FormProvider>
  );
}
