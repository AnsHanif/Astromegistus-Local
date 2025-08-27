'use client';

import React, { useState } from 'react';
import SignupPage from './_components/signup-page';
import VerifyOtpform from '../_components/verify-otp-form';

const Signup = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleSuccess = (data: any) => {
    setShowOtpForm(false);
    console.log('working', data);
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
