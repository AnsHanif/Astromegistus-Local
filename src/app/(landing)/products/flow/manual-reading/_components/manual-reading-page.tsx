'use client';

import React, { useState } from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import Step1ManualReading from './step-1-manual-reading';
import Step2PreparationTime from './step-2-prepartion-time';
import Step3ChooseAstrologer from './step-3-choose-astrologer';
import Step4ManualReadingSchedule from './step-4-manual-reading-schedule';
import Step4SetAstrologerTime from './step-4-set-astrologer-time';
import Step5BookingConfirmed from './step-5-booking-confirmed';
import { useBooking } from '../../_components/booking-context';

const ManualReadingPage = () => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<'auto' | 'manual' | null>(null);
  const { data: bookingData } = useBooking();
  console.log('bookingData is : ', bookingData);
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSelection = (choice: 'auto' | 'manual') => {
    setSelection(choice);
    nextStep();
  };

  return (
    <ProductInfoHeader title="Live Sessions">
      {step === 1 && <Step1ManualReading onNext={nextStep} />}
      {step === 2 && (
        <Step2PreparationTime onNext={nextStep} onPrev={prevStep} />
      )}
      {step === 3 && (
        <Step3ChooseAstrologer onPrev={prevStep} onNext={handleSelection} />
      )}

      {step === 4 && selection === 'auto' && <Step4ManualReadingSchedule />}

      {step === 4 && selection === 'manual' && (
        <Step4SetAstrologerTime onPrev={prevStep} onNext={nextStep} />
      )}

      {step === 5 && <Step5BookingConfirmed />}
    </ProductInfoHeader>
  );
};

export default ManualReadingPage;
