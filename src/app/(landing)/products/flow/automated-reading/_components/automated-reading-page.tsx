'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import DateOfBirthSelect from '@/app/(auth)/signup/_components/date-of-birth-select';
import TimeOfBirth from '@/app/(auth)/signup/_components/time-of-birth';
import { PLACE_OF_BIRTH_OPTIONS } from '@/app/(auth)/signup/_components/signup.constant';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import FormInput from '@/components/common/form-input';
import { Button } from '@/components/ui/button';
import CustomCheckbox from '@/components/common/custom-checkbox/custom-checkbox';
import ProductInfoHeader from '../../_components/product-info-header';
import { Trash2, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCreateBooking } from '@/hooks/mutation/booking-mutation/booking-mutation';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';

type PersonForm = {
  fullName: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  timePeriod: string;
  birthCountry: string;
};

type AutomatedReadingForm = {
  persons: PersonForm[];
};

const AutomatedReadingPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const MAX_PERSONS = 5;
  const searchParams = useSearchParams();
  const { mutate: createBookingMutation, isPending } = useCreateBooking();
  const productId =
    searchParams.get('productId') || 'cmfpjjcvr0006w6swrgonbbys';

  const methods = useForm<AutomatedReadingForm>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      persons: [
        {
          fullName: '',
          day: '',
          month: '',
          year: '',
          hour: '',
          minute: '',
          timePeriod: '',
          birthCountry: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'persons',
  });

  const addPerson = () => {
    if (fields.length < MAX_PERSONS) {
      append({
        fullName: '',
        day: '',
        month: '',
        year: '',
        hour: '',
        minute: '',
        timePeriod: '',
        birthCountry: '',
      });
    }
  };

  const removePerson = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const formatDateOfBirth = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const formatTimeOfBirth = (
    hour: string,
    minute: string,
    timePeriod: string
  ) => {
    if (!hour || !minute || !timePeriod) return '';
    let formattedHour = parseInt(hour);
    if (timePeriod === 'PM' && formattedHour !== 12) {
      formattedHour += 12;
    } else if (timePeriod === 'AM' && formattedHour === 12) {
      formattedHour = 0;
    }
    return `${formattedHour.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
  };

  const onSubmit = (data: AutomatedReadingForm) => {
    if (!productId) {
      console.error('Product ID is required');
      return;
    }

    let hasError = false;

    // Check each person's required fields
    data.persons.forEach((person, personIndex) => {
      // Check full name
      if (!person.fullName || person.fullName.trim().length < 3) {
        console.log('Setting full name error for person', personIndex);
        methods.setError(`persons.${personIndex}.fullName`, {
          type: 'required',
          message: 'Full name is required and must be at least 3 characters',
        });
        hasError = true;
      }

      // Check date of birth
      if (!person.day || !person.month || !person.year) {
        console.log('Setting date error for person', personIndex);
        methods.setError(`persons.${personIndex}.day`, {
          type: 'required',
          message: 'Please select day, month and year of birth',
        });
        methods.setError(`persons.${personIndex}.month`, {
          type: 'required',
          message: 'Please select day, month and year of birth',
        });
        methods.setError(`persons.${personIndex}.year`, {
          type: 'required',
          message: 'Please select day, month and year of birth',
        });
        hasError = true;
      }

      // Check time of birth
      if (!person.hour || !person.minute || !person.timePeriod) {
        console.log('Setting time error for person', personIndex);
        methods.setError(`persons.${personIndex}.hour`, {
          type: 'required',
          message: 'Please select hour, minute and AM/PM for time of birth',
        });
        methods.setError(`persons.${personIndex}.minute`, {
          type: 'required',
          message: 'Please select hour, minute and AM/PM for time of birth',
        });
        methods.setError(`persons.${personIndex}.timePeriod`, {
          type: 'required',
          message: 'Please select hour, minute and AM/PM for time of birth',
        });
        hasError = true;
      }

      // Check place of birth
      if (!person.birthCountry) {
        console.log('Setting country error for person', personIndex);
        methods.setError(`persons.${personIndex}.birthCountry`, {
          type: 'required',
          message: 'Place of birth is required',
        });
        hasError = true;
      }
    });

    // Only proceed with API call if no validation errors
    // Transform form data to API format
    const persons = data.persons.map((person) => ({
      fullName: person.fullName,
      dateOfBirth: formatDateOfBirth(person.day, person.month, person.year),
      timeOfBirth: formatTimeOfBirth(
        person.hour,
        person.minute,
        person.timePeriod
      ),
      placeOfBirth: person.birthCountry,
    }));

    // Filter out incomplete persons
    const validPersons = persons.filter(
      (person) => person.fullName && person.dateOfBirth
    );

    if (validPersons.length === 0) {
      console.error('At least one complete person is required');
      return;
    }

    createBookingMutation({
      productId,
      type: 'AUTOMATED',
      persons: validPersons,
    });
  };

  return (
    <ProductInfoHeader title="Automated Reading" classNames="relative">
      <div>
        <h2 className="text-size-large md:text-size-heading font-medium mb-2">
          Let's get to know you
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
            className="flex flex-col gap-10"
          >
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-6 relative bg-white/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Person {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => removePerson(index)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-start md:flex-row gap-6">
                    <div className="w-full">
                      <FormInput
                        label="Full Name"
                        name={`persons.${index}.fullName`}
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
                            message:
                              'Full name must be at most 100 characters long.',
                          },
                        }}
                      />

                      {/* Full Name Error Display */}
                      {methods.formState.errors.persons?.[index]?.fullName && (
                        <p className="text-red-500 text-sm mt-2">
                          {
                            methods.formState.errors.persons[index]?.fullName
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* Date of Birth with proper validation */}
                    <div className="space-y-2 w-full">
                      <DateOfBirthSelect
                        name={`persons.${index}.dateOfBirth`}
                        day={methods.watch(`persons.${index}.day`) ?? ''}
                        month={methods.watch(`persons.${index}.month`) ?? ''}
                        year={methods.watch(`persons.${index}.year`) ?? ''}
                        onChange={(field, value) => {
                          methods.setValue(`persons.${index}.${field}`, value);
                          methods.trigger(`persons.${index}.${field}`);

                          // Clear errors when user starts filling
                          methods.clearErrors(`persons.${index}.day`);
                          methods.clearErrors(`persons.${index}.month`);
                          methods.clearErrors(`persons.${index}.year`);
                        }}
                        selectClassNames="flex-wrap xs:flex-nowrap"
                        className="hover:border-black focus:border-black text-black text-size-secondary"
                      />
                      {/* Show validation errors for date fields */}
                      {/* Date of Birth Error Display */}
                      {(methods.formState.errors.persons?.[index]?.day ||
                        methods.formState.errors.persons?.[index]?.month ||
                        methods.formState.errors.persons?.[index]?.year) && (
                        <p className="text-red-500 text-sm">
                          Please select day, month and year of birth
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:flex-row gap-6">
                    {/* Time of Birth with proper validation */}
                    <div className="space-y-2 w-full">
                      <TimeOfBirth
                        name={`persons.${index}.timeOfBirth`}
                        hour={methods.watch(`persons.${index}.hour`) ?? ''}
                        minute={methods.watch(`persons.${index}.minute`) ?? ''}
                        timePeriod={
                          methods.watch(`persons.${index}.timePeriod`) ?? ''
                        }
                        onChange={(field, value) => {
                          methods.setValue(`persons.${index}.${field}`, value);
                          methods.trigger(`persons.${index}.${field}`);

                          // Clear errors when user starts filling
                          methods.clearErrors(`persons.${index}.hour`);
                          methods.clearErrors(`persons.${index}.minute`);
                          methods.clearErrors(`persons.${index}.timePeriod`);
                        }}
                        selectClassNames="flex-wrap xs:flex-nowrap"
                        className="hover:border-black focus:border-black text-black text-size-secondary"
                      />
                      {/* Show validation errors for time fields */}
                      {/* Time of Birth Error Display */}
                      {(methods.formState.errors.persons?.[index]?.hour ||
                        methods.formState.errors.persons?.[index]?.minute ||
                        methods.formState.errors.persons?.[index]
                          ?.timePeriod) && (
                        <p className="text-red-500 text-sm">
                          Please select hour, minute and AM/PM for time of birth
                        </p>
                      )}
                    </div>

                    {/* Place of Birth with proper validation */}
                    <div className="flex flex-col gap-4 w-full">
                      <Label
                        htmlFor={`birthPlace-${index}`}
                        className="text-size-tertiary sm:text-size-medium font-semibold"
                      >
                        Place of Birth
                      </Label>
                      <div>
                        <CustomSelect
                          onSelect={(value: string) => {
                            console.log(`Country selected: ${value}`);
                            methods.setValue(
                              `persons.${index}.birthCountry`,
                              value
                            );
                            methods.trigger(`persons.${index}.birthCountry`);

                            // Clear errors when user starts filling
                            methods.clearErrors(
                              `persons.${index}.birthCountry`
                            );
                          }}
                          options={PLACE_OF_BIRTH_OPTIONS}
                          size="sm"
                          variant="default"
                          placeholder="Select country"
                          selectedValue={methods.watch(
                            `persons.${index}.birthCountry`
                          )}
                          chevronClassName="text-black"
                          className="w-full h-12 sm:h-15"
                          triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent border-grey hover:border-black focus:border-black text-black text-size-secondary"
                          contentClassName="w-full max-h-60 overflow-y-auto"
                        />
                        {/* Place of Birth Error Display */}
                        {methods.formState.errors.persons?.[index]
                          ?.birthCountry && (
                          <p className="text-red-500 text-sm mt-2">
                            {
                              methods.formState.errors.persons[index]
                                ?.birthCountry?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add another person button */}
            {fields.length < MAX_PERSONS && (
              <Button
                type="button"
                variant="outline"
                className="w-full text-bronze border-bronze border-3 mb-10 border-dashed hover:bg-bronze/10"
                onClick={addPerson}
              >
                + Add Another Person ({fields.length}/{MAX_PERSONS})
              </Button>
            )}

            {fields.length >= MAX_PERSONS && (
              <div className="text-center text-gray-500 text-sm mb-10">
                Maximum of {MAX_PERSONS} persons allowed
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Button
                type="button"
                variant="outline"
                className="border-black md:max-w-[10rem] w-full px-2"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="bg-emerald-green hover:bg-emerald-green/90 md:max-w-[10rem] w-full px-2 text-white disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? <SpinnerLoader /> : 'Next'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </ProductInfoHeader>
  );
};

export default AutomatedReadingPage;
