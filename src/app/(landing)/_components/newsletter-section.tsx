'use client';
import React, { useState } from 'react';
import { NewsLetterBG } from '@/components/assets';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSnackbar } from 'notistack';
import { useNotifyMeForm } from '@/hooks/mutation/contact-mutations';
import { getErrorMessage } from '@/utils/error-handler';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';

export default function NewsLetterSection() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');

  const { mutate, isPending } = useNotifyMeForm();

  const handleNotify = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      closeSnackbar();
      enqueueSnackbar('Please enter your email.', { variant: 'error' });
      return;
    }

    const emailRegex = /^\S+@\S+$/i;
    if (!emailRegex.test(trimmedEmail)) {
      closeSnackbar();
      enqueueSnackbar('Invalid email address.', { variant: 'error' });
      return;
    }

    if (trimmedEmail.length > 254) {
      closeSnackbar();
      enqueueSnackbar('Email must be at most 254 characters long.', {
        variant: 'error',
      });
      return;
    }

    mutate(
      { email: trimmedEmail },
      {
        onSuccess: (response: any) => {
          setEmail('');
          closeSnackbar();
          enqueueSnackbar(response?.message, { variant: 'success' });
        },
        onError: (error: any) => {
          console.log(error);
          closeSnackbar();
          enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
        },
      }
    );
  };
  return (
    <div
      className="min-h-[300px] bg-cover bg-center text-white px-4 sm:px-8 flex flex-col items-center justify-center text-center gap-4 py-12 sm:py-0"
      style={{ backgroundImage: `url(${NewsLetterBG.src})` }}
    >
      <p className="text-base font-semibold">Supreme Plan (Coming 2026)</p>
      <h2 className="text-2xl md:text-3xl font-bold max-w-3xl leading-tight">
        Be The First To Know When Supreme Launches — And Get An Exclusive Early
        Bird Discount!
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mt-5 w-full md:w-[700px]">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email Address..."
          className="w-full border-white bg-white/10 placeholder:text-[#e5e5e5] text-white px-5 border-[1px] focus:border-white focus:ring-0 focus:outline-none"
        />
        <Button
          variant="default"
          className="w-full md:w-40 text-black"
          onClick={handleNotify}
          disabled={isPending}
        >
          {isPending ? <SpinnerLoader /> : 'Notify Me'}
        </Button>
      </div>
    </div>
  );
}
