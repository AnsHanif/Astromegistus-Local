'use client';
import React from 'react';
import Image from 'next/image';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '@/components/common/form-input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin } from 'lucide-react';

type EditProfileForm = {
  fullName: string;
  email: string;
  message: string;
  termsAndCondition: boolean;
};

export default function ContactPage() {
  const methods = useForm<EditProfileForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  return (
    <div className="px-4 sm:px-12 py-16">
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

        <h1 className="text-size-primary md:text-size-heading-2xl text-center font-bold">
          Get In Touch
        </h1>

        <p className="md:text-size-medium font-semibold text-center max-w-xl mx-auto mb-6">
          We’d Love To Hear From You. Whether It’s A Question, Feedback, Or A
          Request For Guidance — Our Team Is Here For You.
        </p>

        <FormProvider {...methods}>
          <form className="max-w-5xl mx-auto space-y-6 pt-10">
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
              <Label className="block text-size-secondary md:text-size-medium font-semibold mb-4">
                Message
              </Label>

              <Textarea
                className="text-base border-emerald-green placeholder:text-grey py-4 border-[1px] focus:border-black focus:ring-0 focus:outline-none rounded-none h-35"
                placeholder="Write message here..."
              />
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="privacy"
                className="cursor-pointer h-6 w-6"
              />
              <label htmlFor="privacy" className="cursor-pointer font-semibold">
                I agree to the privacy policy.
              </label>
            </div>

            <div className="flex justify-center items-center my-10 md:my-15">
              <Button className="w-full md:w-61 bg-emerald-green text-white">
                Send Message
              </Button>
            </div>
          </form>
        </FormProvider>

        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-12 items-start lg:items-center font-semibold max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Mail size={24} className="mb-0.5" /> Email:{' '}
            <span className="underline">info@astromegistus.com</span>
          </div>
          <div className="flex items-center gap-4">
            <MapPin size={24} className="mb-0.5" /> Address: 1911 Crossgate
            Park, San Antonio, TX 78247
          </div>
        </div>
      </div>
    </div>
  );
}
