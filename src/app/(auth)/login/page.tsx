'use client';

import React, { useState } from 'react';
import LoginPage from './_components/login-page';
import VerifyOtpform from '../_components/verify-otp-form';

const Login = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleSuccess = (data: any) => {
    setShowOtpForm(false);
  };

  return (
    <>
      {!showOtpForm ? (
        <LoginPage onSuccess={() => setShowOtpForm(true)} />
      ) : (
        <VerifyOtpform
          onBack={() => setShowOtpForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default Login;
