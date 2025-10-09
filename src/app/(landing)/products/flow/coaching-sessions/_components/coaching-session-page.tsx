'use client';

import React, { useState, useEffect } from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import Step1ChooseCoach from './step-1-choose-coach';
import Step2AutoScheduled from './step-2-auto-scheduled';
import Step2Schedule from './step-2-schedule';
import Step4BookingConfirmed from './step-4-booking-confirmed';
import { useBooking } from '../../_components/booking-context';

interface CoachingBookingData {
  sessionId: string;
  providerId: string;
  selectedDate: string;
  selectedTime: string;
  timezone: string;
  notes?: string;
}

interface CoachingSessionsPageProps {
  initialBookingData?: CoachingBookingData;
}

const CoachingSessionsPage: React.FC<CoachingSessionsPageProps> = ({ 
  initialBookingData 
}) => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<'auto' | 'manual' | null>(null);
  const { data: bookingData, updateData } = useBooking();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Function to handle booking data from external source
  const handleBookingData = (bookingData: CoachingBookingData) => {
    // Update the booking context with the provided data
    updateData({
      productId: bookingData.sessionId,
      selectedProvider: bookingData.providerId,
      selectedDate: bookingData.selectedDate,
      selectedTime: bookingData.selectedTime,
      timezone: bookingData.timezone,
      notes: bookingData.notes,
      bookingType: 'coaching-session',
      status: 'confirmed',
      sessionTitle: 'Coaching Session',
      sessionDescription: 'Live coaching session with your selected coach',
    });
    
    // Skip to confirmation step since all data is provided
    setStep(3);
  };

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

  // Handle initial booking data if provided
  useEffect(() => {
    if (initialBookingData) {
      handleBookingData(initialBookingData);
    }
  }, [initialBookingData]);

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
