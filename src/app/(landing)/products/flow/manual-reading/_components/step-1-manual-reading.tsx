'use client';

import React, {
  ChangeEvent,
  FC,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { Button } from '@/components/ui/button';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '@/components/common/form-input';
import DateOfBirthSelect from '@/app/(auth)/signup/_components/date-of-birth-select';
import TimeOfBirth from '@/app/(auth)/signup/_components/time-of-birth';
import { Label } from '@/components/ui/label';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import { PLACE_OF_BIRTH_OPTIONS } from '@/app/(auth)/signup/_components/signup.constant';
import { Input } from '@/components/ui/input';
import { ManualReading, ManualReadingForm } from './manual-reading.interfaces';
import { useBooking } from '../../_components/booking-context';
import { useCheckLocation } from '@/hooks/mutation/booking-mutation/booking-mutation';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { enqueueSnackbar } from 'notistack';

interface Step1ManualReading extends ManualReading {
  classNames?: string;
}

const Step1ManualReading: FC<Step1ManualReading> = ({ onNext, onPrev }) => {
  const methods = useForm<ManualReadingForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  // Get booking context to store data and initialize form
  const { data: bookingData, updateData } = useBooking();

  // Location checking mutation
  const { mutate: checkLocationMutation, isPending: isCheckingLocation } =
    useCheckLocation();

  const [formData, setFormData] = useState({
    day: bookingData.day || '',
    month: bookingData.month || '',
    year: bookingData.year || '',
    hour: bookingData.hour || '',
    minute: bookingData.minute || '',
    timePeriod: bookingData.timePeriod || '',
    gender: bookingData.gender || '',
    birthCountry: bookingData.birthCountry || '',
    birthCountryLabel: bookingData.birthCountryLabel || '',
    birthCity: bookingData.birthCity || '',
    question1: bookingData.question1 || '',
    question2: bookingData.question2 || '',
  });

  // Initialize form with context data
  useEffect(() => {
    if (bookingData.fullName) {
      methods.setValue('fullName', bookingData.fullName);
    }
  }, [bookingData.fullName, methods]);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelect = useCallback(
    (field: 'gender' | 'birthCountry', value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      methods.clearErrors(field);
    },
    [methods]
  );

  const handleCountrySelect = useCallback(
    (value: string) => {
      // Find the selected country option to get both value and label
      const selectedCountry = PLACE_OF_BIRTH_OPTIONS.find(
        (option) => option.value === value
      );

      setFormData((prev) => ({
        ...prev,
        birthCountry: value,
        birthCountryLabel: selectedCountry?.label || value,
      }));
      methods.clearErrors('birthCountry');
    },
    [methods]
  );

  const checkLocationForPerson = () => {
    const formValues = methods.getValues();
    const { birthCity } = formValues;
    const { birthCountry } = formData;

    console.log('Location check values:', { birthCountry, birthCity });

    // Only check if both country and city are provided
    if (birthCountry && birthCity && birthCity.trim().length >= 2) {
      checkLocationMutation(
        {
          cityName: birthCity.trim(),
          countryID: birthCountry,
        },
        {
          onSuccess: (response: any) => {
            console.log('Location check response:', response);
            if (
              response.exists &&
              response.location &&
              response.location.length > 0
            ) {
              const location = response.location[0]; // Get first location from array
              const locationInfo = {
                lat: location.lat,
                lng: location.lng,
                tz: location.tz,
              };

              // Store location data in context
              updateData({
                ...bookingData,
                fullName: formValues.fullName,
                day: formData.day,
                month: formData.month,
                year: formData.year,
                hour: formData.hour,
                minute: formData.minute,
                timePeriod: formData.timePeriod,
                gender: formData.gender,
                birthCountry: formData.birthCountry,
                birthCountryLabel: formData.birthCountryLabel,
                birthCity: formValues.birthCity,
                question1: formData.question1,
                question2: formData.question2,
                latitude: locationInfo.lat,
                longitude: locationInfo.lng,
                locationTimezone: locationInfo.tz,
              });

              console.log('Location data stored:', locationInfo);
              // Proceed to next step after storing location data
              onNext?.();
            } else {
              console.log('Location not found in external API');
              enqueueSnackbar(
                'Location not found. Please check your city and country.',
                {
                  variant: 'error',
                }
              );
            }
          },
          onError: (error) => {
            console.error('Location check failed:', error);
            enqueueSnackbar('Failed to verify location. Please try again.', {
              variant: 'error',
            });
          },
        }
      );
    } else {
      // No location to check, proceed directly to next step
      updateData({
        ...bookingData,
        fullName: formValues.fullName,
        day: formData.day,
        month: formData.month,
        year: formData.year,
        hour: formData.hour,
        minute: formData.minute,
        timePeriod: formData.timePeriod,
        gender: formData.gender,
        birthCountry: formData.birthCountry,
        birthCountryLabel: formData.birthCountryLabel,
        birthCity: formValues.birthCity,
        question1: formData.question1,
        question2: formData.question2,
      });
      onNext?.();
    }
  };

  const onSubmit = (data: ManualReadingForm) => {
    // Validate all required fields before proceeding (same as automated reading)
    let hasError = false;

    // Check full name
    if (!data.fullName || data.fullName.trim().length < 3) {
      methods.setError('fullName', {
        type: 'required',
        message: 'Full name is required and must be at least 3 characters',
      });
      hasError = true;
    }

    // Check date of birth
    if (!formData.day || !formData.month || !formData.year) {
      methods.setError('dateOfBirth', {
        type: 'required',
        message: 'Please select day, month and year of birth',
      });
      hasError = true;
    }

    // Check time of birth
    if (!formData.hour || !formData.minute || !formData.timePeriod) {
      methods.setError('timeOfBirth', {
        type: 'required',
        message: 'Please select hour, minute and AM/PM for time of birth',
      });
      hasError = true;
    }

    // Check place of birth
    if (!formData.birthCountry) {
      methods.setError('birthCountry', {
        type: 'required',
        message: 'Place of birth is required',
      });
      hasError = true;
    }

    // Check city of birth
    if (!data.birthCity || data.birthCity.trim().length < 2) {
      methods.setError('birthCity', {
        type: 'required',
        message: 'City of birth is required and must be at least 2 characters',
      });
      hasError = true;
    }

    // Only proceed if no validation errors
    if (!hasError) {
      // Check location first, then proceed to next step
      checkLocationForPerson();
    }
  };

  return (
    <div>
      <h2 className="text-size-large md:text-size-heading font-medium mb-6">
        Let’s get to know you
      </h2>

      {/* Form */}
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="max-w-[1600px] mx-auto"
        >
          <div className="w-full h-full">
            <div className="w-full flex md:flex-row flex-col gap-6 md:gap-8  mb-8">
              <FormInput
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Enter full name"
                className="w-full"
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
              />

              <DateOfBirthSelect
                name="dateOfBirth"
                parentClassName="w-full"
                day={formData.day}
                month={formData.month}
                year={formData.year}
                onChange={handleFieldChange}
                selectClassNames="flex-wrap xs:flex-nowrap"
                className="hover:border-black focus:border-black text-black text-size-secondary"
              />
            </div>

            <div className="w-full flex md:flex-row flex-col gap-6 md:gap-8 mb-4">
              <TimeOfBirth
                name="timeOfBirth"
                hour={formData.hour}
                minute={formData.minute}
                timePeriod={formData.timePeriod}
                onChange={handleFieldChange}
                selectClassNames="flex-wrap xs:flex-nowrap"
                className="hover:border-black focus:border-black text-black text-size-secondary"
                parentClassName="w-full"
              />
              <div className="flex w-full flex-col gap-4 mb-4">
                <Label
                  htmlFor="birthPlace"
                  className="text-size-tertiary sm:text-size-medium font-semibold"
                >
                  Place of birth
                </Label>
                <CustomSelect
                  onSelect={handleCountrySelect}
                  options={PLACE_OF_BIRTH_OPTIONS}
                  size="sm"
                  variant="default"
                  placeholder="Select country"
                  selectedValue={formData.birthCountry}
                  chevronClassName="text-black"
                  className="w-full h-12 sm:h-15"
                  triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent border-grey hover:border-black focus:border-black text-black text-size-secondary"
                  contentClassName="w-full max-h-60 overflow-y-auto"
                />
                {/* Country Error Display */}
                {methods.formState.errors.birthCountry && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.birthCountry.message}
                  </p>
                )}
              </div>
            </div>

            {/* City of Birth */}
            <div className="w-full flex mb-4 md:mb-8 md:flex-row flex-col gap-6 md:gap-8">
              <div className="w-full">
                <FormInput
                  label="City Of Birth"
                  name="birthCity"
                  type="text"
                  placeholder="Enter City Name"
                  className="w-full"
                  rules={{
                    required: 'City of birth is required',
                    validate: (value) =>
                      value.trim().length >= 2 ||
                      'City name must be at least 2 characters long.',
                    maxLength: {
                      value: 50,
                      message: 'City name must be at most 50 characters long.',
                    },
                  }}
                />
              </div>
              <div className="w-full"></div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-10">
            <Label>Your Questions (Max 2)</Label>

            <Input
              value={formData.question1}
              placeholder="Question 1 (optional)"
              className="border-grey"
              name="question1"
              onChange={handleChange}
            />

            <Input
              value={formData.question2}
              placeholder="Question 2 (optional)"
              className="border-grey"
              name="question2"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <Button
              onClick={onPrev}
              variant={'outline'}
              className="border-black hover:bg-grey-light-50 md:max-w-[10rem] w-full px-2"
            >
              Back
            </Button>
            <Button
              onClick={methods.handleSubmit(onSubmit)}
              variant={'outline'}
              className="bg-emerald-green hover:bg-emerald-green/90 md:max-w-[10rem] w-full px-2 text-white disabled:opacity-50"
              disabled={isCheckingLocation}
            >
              {isCheckingLocation ? <SpinnerLoader /> : 'Next'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Step1ManualReading;
