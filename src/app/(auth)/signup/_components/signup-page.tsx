'use client';

import React, { useCallback, useState } from 'react';
import AuthForm from '../../_components/auth-form';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '@/components/common/form-input';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import { Label } from '@/components/ui/label';
import { GENDER_TYPE, PLACE_OF_BIRTH_OPTIONS } from './signup.constant';
import { Button } from '@/components/ui/button';
import Link from '@/components/common/custom-link/custom-link';
import DateOfBirthSelect from './date-of-birth-select';
import TimeOfBirth from './time-of-birth';

type SignupForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupPage = () => {
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

  const methods = useForm<SignupForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const handleFieldChange = useCallback(
    (
      field: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'timePeriod',
      value: string
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const onSubmit = (data: SignupForm) => {
    console.log('onSubmit data ', data);
  };

  return (
    <AuthForm
      heading="Join Astromegistus"
      subheading="Begin your cosmic journey with us"
      buttonText="Create Account"
      onButtonClick={() => console.log('Signup Button is Clicked')}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="!flex flex-col gap-6 md:gap-16 md:flex-row w-full h-full max-w-[1000px] justify-between"
        >
          <div className="w-full space-y-6 md:space-y-8 mb-4">
            <FormInput
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="Enter full name"
              // rules={{ required: 'Full name is required' }}
            />

            {/* Date Of Birth */}

            <DateOfBirthSelect
              day={formData.day}
              month={formData.month}
              year={formData.year}
              onChange={handleFieldChange}
            />

            {/* Place of Birth */}

            <div className="flex flex-col gap-4">
              <Label
                htmlFor="birthPlace"
                className="text-size-tertiary sm:text-size-medium font-semibold"
              >
                Place of birth
              </Label>
              <CustomSelect
                onSelect={(value: string) =>
                  setFormData({ ...formData, birthCountry: value })
                }
                options={PLACE_OF_BIRTH_OPTIONS}
                // classNames={{}}
                size="sm"
                variant="default"
                placeholder="Select country"
                selectedValue={formData.birthCountry}
                className="w-full h-12 sm:h-15"
                triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent  border-grey"
                contentClassName="w-full max-h-60 overflow-y-auto"
              />
            </div>

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Password"
              // rules={{
              //   required: 'Password is required',
              //   minLength: {
              //     value: 6,
              //     message: 'Password must be at least 6 characters',
              //   },
              // }}
            />
          </div>

          <div className="w-full space-y-6 md:space-y-8">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full"
              // rules={{
              //   required: 'Email is required',
              //   pattern: {
              //     value: /^\S+@\S+$/i,
              //     message: 'Invalid email address',
              //   },
              // }}
            />

            {/* Time of Birth */}

            <TimeOfBirth
              hour={formData.hour}
              minute={formData.minute}
              timePeriod={formData.timePeriod}
              onChange={handleFieldChange}
            />

            {/* Gender */}
            <div className="flex flex-col items-start space-y-4">
              <Label
                htmlFor="gender"
                className="text-size-tertiary sm:text-size-medium font-semibold"
              >
                Gender
              </Label>

              <CustomSelect
                onSelect={(value: string) =>
                  setFormData({ ...formData, gender: value })
                }
                options={GENDER_TYPE}
                // classNames={{}}
                size="sm"
                variant="default"
                placeholder="Select gender"
                selectedValue={formData.gender}
                className="w-full h-12 sm:h-15"
                triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent  border-grey"
                contentClassName="w-full max-h-60 overflow-y-auto"
              />
            </div>

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              // rules={{
              //   required: 'Password is required',
              //   minLength: {
              //     value: 6,
              //     message: 'Password must be at least 6 characters',
              //   },
              // }}
            />
          </div>
        </form>

        <Button className="md:w-[470px] w-full text-black">
          Create Account
        </Button>

        <div className="text-center md:w-[470px]">
          Already have an account?{' '}
          <Link href="/login" className="text-golden-yellow hover:underline">
            Login
          </Link>
        </div>
      </FormProvider>
    </AuthForm>
  );
};

export default SignupPage;
