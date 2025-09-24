'use client';

import React, { useState } from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import Step1ChooseCoach from './step-1-choose-coach';
import Step2AutoScheduled from './step-2-auto-scheduled';
import Step2Schedule from './step-2-schedule';
import Step4BookingConfirmed from './step-4-booking-confirmed';

const CoachingSessionsPage = () => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<'auto' | 'manual' | null>(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSelection = (choice: 'auto' | 'manual') => {
    setSelection(choice);
    if (choice === 'auto') {
      // For auto-match, go to auto-scheduled step
      setStep(2);
    } else {
      // For manual selection, go to scheduling steps
      nextStep();
    }
  };

  return (
    <ProductInfoHeader title="Coaching Sessions">
      {step === 1 && <Step1ChooseCoach onNext={handleSelection} />}
      {step === 2 && selection === 'auto' && <Step2AutoScheduled />}
      {step === 2 && selection === 'manual' && (
        <Step2Schedule onNext={nextStep} onPrev={prevStep} />
      )}

      {step === 3 && <Step4BookingConfirmed />}
    </ProductInfoHeader>
  );
};

export default CoachingSessionsPage;
