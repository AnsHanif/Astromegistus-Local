import SuccessAnimation from '@/components/common/success-animation';
import React from 'react';
import CoachingInfoHeader from '../../_components/coaching-info-header';

interface Step3BookingConfirmedProps {
  isAutoMatch: boolean;
}

const Step3BookingConfirmed = ({ isAutoMatch }: Step3BookingConfirmedProps) => {
  return (
    <CoachingInfoHeader title="Coaching Sessions">
      <div className="min-h-[80vh] flex flex-col gap-6 mb-36 items-center justify-center max-w-[40rem] w-full mx-auto text-center">
        {/* Success Animation */}
        <SuccessAnimation />

        {/* Heading */}
        <h2 className="text-size-heading md:text-size-primary font-bold">
          {isAutoMatch ? 'Auto-Scheduling Enabled' : 'Booking Confirmed!'}
        </h2>

        {/* Subtext */}
        <p className="text-gray-700">
          {isAutoMatch
            ? 'Our system will automatically schedule your 1 session with available astrologers at the best possible times based on your preferences.'
            : 'Your live session has been successfully booked.'}
        </p>

        {/* Booking Details */}
        {!isAutoMatch && (
          <div className="mt-6 w-full text-left max-w-[25rem] mx-auto space-y-3">
            <div className="flex flex-col xs:flex-row justify-between xs:gap-2">
              <span className="font-semibold w-32">Coaching Title:</span>
              <span className="text-gray-900">Life Coaching</span>
            </div>

            <div className="flex flex-col xs:flex-row justify-between xs:gap-2">
              <span className="font-semibold w-32">Date &amp; Time:</span>
              <span className="text-gray-900">Aug 15, 2025, 2:00 PM (EST)</span>
            </div>

            <div className="flex flex-col xs:flex-row justify-between xs:gap-2">
              <span className="font-semibold w-32">Astrologer/Coach:</span>
              <span className="text-gray-900">Dr. Elara Vance</span>
            </div>
          </div>
        )}
      </div>
    </CoachingInfoHeader>
  );
};

export default Step3BookingConfirmed;
