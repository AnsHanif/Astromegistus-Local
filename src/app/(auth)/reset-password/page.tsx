'use client';

import React, { useState } from 'react';
import ForgotPasswordForm from './_components/forgot-password-form';
import ResetPasswordForm from './_components/reset-password-form';
import VerifyOtpform from '../_components/verify-otp-form';
import Cookies from 'js-cookie';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<'forgot' | 'verify' | 'reset'>('forgot');

  const handleSuccess = (data: any) => {
    setStep('reset');
    Cookies.set('temp-tk-astro-np', data?.token);
  };
  return (
    <>
      {step === 'forgot' && (
        <ForgotPasswordForm onSuccess={() => setStep('verify')} />
      )}
      {step === 'verify' && (
        <VerifyOtpform
          onBack={() => setStep('forgot')}
          onSuccess={handleSuccess}
        />
      )}
      {step === 'reset' && (
        <ResetPasswordForm onBack={() => setStep('forgot')} />
      )}
    </>
  );
}
