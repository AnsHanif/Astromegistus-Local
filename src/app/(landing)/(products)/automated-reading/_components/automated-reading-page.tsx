'use client';

import React, { useCallback, useState } from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import DateOfBirthSelect from '@/app/(auth)/signup/_components/date-of-birth-select';
import TimeOfBirth from '@/app/(auth)/signup/_components/time-of-birth';
import { PLACE_OF_BIRTH_OPTIONS } from '@/app/(auth)/signup/_components/signup.constant';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '@/components/common/form-input';
import { Button } from '@/components/ui/button';
import CustomCheckbox from '@/components/common/custom-checkbox/custom-checkbox';

type AutomatedReadingForm = {
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

const AutomatedReadingPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const methods = useForm<AutomatedReadingForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

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

  const onSubmit = (data: AutomatedReadingForm) => {
    console.log('sumbitted data are : ', data);
  };

  return (
    <ProductInfoHeader title="Automated Reading" classNames="relative">
      <div>
        <h2 className="text-size-large md:text-size-heading font-medium mb-2">
          Let’s get to know you
        </h2>
        <div className="mb-6">
          <CustomCheckbox
            label="Use my saved birth details for this booking."
            checked={isChecked}
            labelClassNames="mt-0.5 text-size-secondary"
            onChange={setIsChecked}
          />
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="!flex flex-col gap-6 md:gap-16 mx-auto md:flex-row w-full h-full max-w-[1600px] justify-between"
          >
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
                }}
              />

              <DateOfBirthSelect
                name="dateOfBirth"
                day={formData.day}
                month={formData.month}
                year={formData.year}
                onChange={handleFieldChange}
                selectClassNames="flex-wrap xs:flex-nowrap"
                className="hover:border-black focus:border-black text-black text-size-secondary"
              />
            </div>

            <div className="w-full space-y-6 md:space-y-8 mb-4">
              <TimeOfBirth
                name="timeOfBirth"
                hour={formData.hour}
                minute={formData.minute}
                timePeriod={formData.timePeriod}
                onChange={handleFieldChange}
                selectClassNames="flex-wrap xs:flex-nowrap"
                className="hover:border-black focus:border-black text-black text-size-secondary"
              />

              <div className="flex flex-col gap-4 mb-4">
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
                  chevronClassName="text-black"
                  className="w-full h-12 sm:h-15"
                  triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent border-grey hover:border-black focus:border-black text-black text-size-secondary"
                  contentClassName="w-full max-h-60 overflow-y-auto"
                />
                {methods.formState.errors.birthCountry && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.birthCountry.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </FormProvider>

        <Button
          variant={'outline'}
          className="w-full text-bronze border-bronze border-3 mb-10 border-dashed"
        >
          + Add Another Person
        </Button>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <Button
            variant={'outline'}
            className="border-black md:max-w-[10rem] w-full px-2"
          >
            Back
          </Button>
          <Button
            variant={'outline'}
            className="bg-emerald-green hover:bg-emerald-green/90 md:max-w-[10rem] w-full px-2 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </ProductInfoHeader>
  );
};

export default AutomatedReadingPage;
