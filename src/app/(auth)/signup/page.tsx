'use client';

import React, { useState } from 'react';
import SignupPage from './_components/signup-page';
import VerifyOtpform from '../_components/verify-otp-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '@/store/slices/user-slice';

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleSuccess = (data: any) => {
    setShowOtpForm(false);

    if (data?.token && data?.user) {
      Cookies.set('astro-tk', data?.token);
      localStorage.setItem('role', 'GUEST');
      dispatch(setCurrentUser({ user: data.user, token: data?.token }));
      window.location.href = '/dashboard/booked-readings';
    } else {
      Cookies.set('temp-nutk-astro', data?.token);
      router.push('/pricing-plans');
    }
  };
  return (
    <>
      {!showOtpForm ? (
        <SignupPage onSuccess={() => setShowOtpForm(true)} />
      ) : (
        <VerifyOtpform
          onBack={() => setShowOtpForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default Signup;
