'use client';
import React from 'react';
import Image from 'next/image';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '@/components/common/form-input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin } from 'lucide-react';
import { useSubmitContactForm } from '@/hooks/mutation/contact-mutations';
import { useSnackbar } from 'notistack';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';

type EditProfileForm = {
  fullName: string;
  email: string;
  message: string;
  termsAndCondition: boolean;
};

export default function ContactPage() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const methods = useForm<EditProfileForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { mutate, isPending } = useSubmitContactForm();

  const onSubmit = (data: EditProfileForm) => {
    mutate(data, {
      onSuccess: (response: any) => {
        closeSnackbar();
        enqueueSnackbar(
          response?.message || 'Message sent successfully! We\'ll get back to you soon.',
          { variant: 'success' }
        );
        methods.reset();
      },
      onError: (error: any) => {
        closeSnackbar();
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again.';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      },
    });
  };

  return (
    <div className="px-4 sm:px-12 py-6 sm:py-16">
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/map.svg"
            alt="World Map"
            layout="fill"
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-5xl text-center font-bold">
          Get In Touch
        </h1>

        <p className="text-base font-semibold text-center max-w-xl mx-auto mb-6 pt-2">
          We'd Love To Hear From You. Whether It's A Question, Feedback, Or A
          Request For Guidance — Our Team Is Here For You.
        </p>

        <FormProvider {...methods}>

          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="max-w-5xl mx-auto space-y-6 pt-10"
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-20">
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
                className="border-emerald-green"
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="border-emerald-green"
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
            </div>
            <div>
              <Label className="block text-base font-semibold mb-4">
                Message
              </Label>

              <Textarea
                {...methods.register('message', {
                  required: 'Message is required',
                  minLength: {
                    value: 10,
                    message: 'Message must be at least 10 characters long',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Message must be at most 1000 characters long',
                  },
                })}
                className="text-base border-emerald-green placeholder:text-grey py-4 border-[1px] focus:border-black focus:ring-0 focus:outline-none rounded-none h-35"
                placeholder="Write message here..."
              />

              {methods.formState.errors?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors?.message?.message as string}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-4">
                <input
                  {...methods.register('termsAndCondition', {
                    required: 'You must agree to the privacy policy',
                  })}
                  type="checkbox"
                  id="privacy"
                  className="cursor-pointer h-6 w-6"
                />
                <label htmlFor="privacy" className="cursor-pointer font-semibold">
                  I agree to the privacy policy.
                </label>
              </div>

              {methods.formState.errors?.termsAndCondition && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors?.termsAndCondition?.message as string}
                </p>
              )}
            </div>

            <div className="flex justify-center items-center my-10 md:my-15">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full md:w-61 bg-emerald-green text-white flex items-center justify-center gap-2"
              >
                {isPending && <SpinnerLoader />}
                {isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </FormProvider>

        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-12 items-start lg:items-center font-semibold max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Mail size={24} className="mb-0.5" />Email: <span className="underline">info@astromegistus.com</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={24} className="mb-0.5 flex-shrink-0 transform translate-x-0.5 -translate-y-0.5" />Address: 1911 Crossgate
            Park, San Antonio, TX 78247
          </div>
        </div>
      </div>
    </div>
  );
}
