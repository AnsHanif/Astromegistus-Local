'use client';
import React, { useCallback, useEffect, useState } from 'react';
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
import { useSignUpUser } from '@/hooks/mutation/auth-mutation/auth';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

type SignupForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
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

type SignupPageProps = { onSuccess: () => void };

const SignupPage = ({ onSuccess }: SignupPageProps) => {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [formSession, setFormSession] = useState<string | null>(null);
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

  const { mutate, isPending } = useSignUpUser();

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

  const onSubmit = (data: SignupForm) => {
    if (!formSession) return;
    let hasError = false;

    if (!formData.day || !formData.month || !formData.year) {
      methods.setError('dateOfBirth', {
        type: 'required',
        message: 'Please select day, month and year of birth.',
      });
      hasError = true;
    }

    if (!formData.hour || !formData.minute || !formData.timePeriod) {
      methods.setError('timeOfBirth', {
        type: 'required',
        message: 'Please select hour, minute and AM/PM for time of birth.',
      });
      hasError = true;
    }

    if (!formData.birthCountry) {
      methods.setError('birthCountry', {
        type: 'required',
        message: 'Place of birth is required.',
      });
      hasError = true;
    }

    if (!formData.gender) {
      methods.setError('gender', {
        type: 'required',
        message: 'Gender is required.',
      });
      hasError = true;
    }

    if (hasError) return;

    const { fullName, email, password } = data;
    const { birthCountry, day, gender, hour, minute, month, timePeriod, year } =
      formData;

    const signupData = {
      fullName,
      email,
      password,
      gender,
      birthCountry,
      type: formSession,
      dateOfBirth: { day, month, year },
      timeOfBirth: { hour, minute, timePeriod },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    mutate(signupData, {
      onSuccess: (response: any) => {
        Cookies.set('temp-tk-astro', response?.data?.token);
        onSuccess();
        closeSnackbar();
        enqueueSnackbar(response?.message, { variant: 'success' });
      },
      onError: (error: any) => {
        console.log(error);
        let message = 'Something went wrong. Please try again.';
        if (error?.response?.data?.message) {
          message = error.response.data.message;
        } else if (error?.message) {
          message = error.message;
        }
        closeSnackbar();
        enqueueSnackbar(message, { variant: 'error' });
      },
    });
  };

  useEffect(() => {
    const type = sessionStorage.getItem('signup-type');
    if (!type) {
      router.replace('/auth-selection');
    } else {
      setFormSession(type);
    }
  }, [router]);

  return (
    <AuthForm
      heading={`Join Astromegistus ${
        formSession === 'guest' ? 'as Guest' : ''
      }`}
      subheading="Begin your cosmic journey with us"
      buttonText="Create Account"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="!flex flex-col gap-6 md:gap-16 md:flex-row w-full h-full max-w-[1000px] justify-between"
        >
          <div style={{ display: 'none' }}>
            <input type="email" name="prevent_autofill" autoComplete="email" />
            <input
              type="password"
              name="password_fake"
              autoComplete="new-password"
            />
          </div>
          <div className="w-full space-y-6 md:space-y-8 mb-4">
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
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: 'Full name can only contain letters and spaces.',
                },
              }}
            />

            {/* Date Of Birth */}

            <DateOfBirthSelect
              name="dateOfBirth"
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
                  handleSelect('birthCountry', value)
                }
                options={PLACE_OF_BIRTH_OPTIONS}
                size="sm"
                variant="default"
                placeholder="Select country"
                selectedValue={formData.birthCountry}
                className="w-full h-12 sm:h-15"
                triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent  border-grey"
                contentClassName="w-full max-h-60 overflow-y-auto"
              />
              {methods.formState.errors.birthCountry && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.birthCountry.message}
                </p>
              )}
            </div>

            <FormInput
              label="Password"
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
          </div>

          <div className="w-full space-y-6 md:space-y-8">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full"
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

            {/* Time of Birth */}

            <TimeOfBirth
              name="timeOfBirth"
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
                onSelect={(value: string) => handleSelect('gender', value)}
                options={GENDER_TYPE}
                size="sm"
                variant="default"
                placeholder="Select gender"
                selectedValue={formData.gender}
                className="w-full h-12 sm:h-15"
                triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent  border-grey"
                contentClassName="w-full max-h-60 overflow-y-auto"
              />

              {methods.formState.errors.gender && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.gender.message}
                </p>
              )}
            </div>

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              rules={{
                required: 'Confirm password is required',
                validate: (value, formValues) => {
                  return (
                    value === formValues.password || 'Passwords do not match'
                  );
                },
              }}
            />
          </div>
        </form>

        <div className="flex flex-col items-start gap-4">
          <Button
            className="w-full max-w-[129px] h-[60px] text-black p-2 sm:w-[129px]"
            onClick={methods.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <SpinnerLoader /> : 'Create Account'}
          </Button>

          <div className="text-left md:w-[470px]">
            Already have an account?{' '}
            <Link href="/login" className="text-golden-yellow hover:underline">
              Login
            </Link>
          </div>
        </div>
      </FormProvider>
    </AuthForm>
  );
};

export default SignupPage;
