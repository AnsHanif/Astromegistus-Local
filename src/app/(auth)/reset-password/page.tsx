'use client';

import React, { useState } from 'react';
import ForgotPasswordForm from './_components/forgot-password-form';
import ResetPasswordForm from './_components/reset-password-form';
import VerifyOtpform from '../_components/verify-otp-form';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<'forgot' | 'reset' | 'verify'>('forgot');

  return (
    <>
      {step === 'forgot' && (
        <ForgotPasswordForm onSuccess={() => setStep('verify')} />
      )}
      {step === 'verify' && (
        <VerifyOtpform
          onBack={() => setStep('forgot')}
          onSuccess={() => setStep('reset')}
        />
      )}
      {step === 'reset' && (
        <ResetPasswordForm onBack={() => setStep('verify')} />
      )}
    </>
  );
}
