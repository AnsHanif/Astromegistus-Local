'use client';
import React, { FC, useState } from 'react';
import Step1CoachingSelection from './step-1-coach-selection';
import Step2SetCoachTime from './step-2-set-coach-time';
import Step3BookingConfirmed from './step-3-booking-confirmed';

interface CoachingSelectionPageProps {}

const CoachingSelectionPage: FC<CoachingSelectionPageProps> = () => {
  const [isAutoMatch, setIsAutoMatch] = useState(false);
  const [step, setStep] = useState(1);

  const onNext = (nextStep: number) => {
    setStep(nextStep);
  };

  const onPrev = (prevStep: number) => {
    setStep(prevStep);
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1CoachingSelection
            isAutoMatch={isAutoMatch}
            setIsAutoMatch={setIsAutoMatch}
            onNext={onNext}
          />
        );
      case 2:
        return <Step2SetCoachTime onNext={onNext} onPrev={onPrev} />;
      case 3:
        return <Step3BookingConfirmed isAutoMatch={isAutoMatch} />;
      default:
        return (
          <Step1CoachingSelection
            isAutoMatch={isAutoMatch}
            setIsAutoMatch={setIsAutoMatch}
            onNext={onNext}
          />
        );
    }
  };

  return <div className="min-h-screen w-full">{renderCurrentStep()}</div>;
};

export default CoachingSelectionPage;
