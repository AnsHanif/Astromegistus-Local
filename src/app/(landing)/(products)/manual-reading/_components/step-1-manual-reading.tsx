'use client';

import React, { ChangeEvent, FC, useCallback, useState } from 'react';
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

interface Step1ManualReading extends ManualReading {
  classNames?: string;
}

const Step1ManualReading: FC<Step1ManualReading> = ({ onNext, onPrev }) => {
  const methods = useForm<ManualReadingForm>({
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
    question1: '',
    question2: '',
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

  const onSubmit = (data: ManualReadingForm) => {
    console.log('sumbitted data are : ', data);
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
          <div className="!flex flex-col gap-6 md:gap-16 md:flex-row w-full h-full justify-between">
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
        </form>
      </FormProvider>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <Button
          onClick={onPrev}
          variant={'outline'}
          className="border-black hover:bg-grey-light-50 md:max-w-[10rem] w-full px-2"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          variant={'outline'}
          className="bg-emerald-green hover:bg-emerald-green/90 md:max-w-[10rem] w-full px-2 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step1ManualReading;
