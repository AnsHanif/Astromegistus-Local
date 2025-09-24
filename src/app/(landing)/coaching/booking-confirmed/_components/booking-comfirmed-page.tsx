'use client';

import React from 'react';
import CoachingInfoHeader from '../../_components/coaching-info-header';
import CoachingSessionCard from './coaching-card-session';
import { Button } from '@/components/ui/button';
import SuccessAnimation from '@/components/common/success-animation';
import { useRouter } from 'next/navigation';

const BookingConfirmedPage = () => {
  const router = useRouter();

  const selectCoach = () => {
    router.push('/coaching/scheduling');
  };

  return (
    <CoachingInfoHeader title="Booked Coaching">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        {/* Heading */}
        <SuccessAnimation />
        <h2 className="text-size-heading md:text-size-primary font-bold mt-4">
          Your Coaching Are Booked!
        </h2>
        <p className="mt-2 text-sm">
          Thank you for your purchase. Your cosmic journey begins now.
        </p>
      </div>

      {/* Reading Session Card */}
      <div>
        <h2 className="text-size-large md:text-size-heading font-medium mb-2">
          Scheduled Coaching Sessions <span className="text-sm">(1)</span>
        </h2>
        <CoachingSessionCard
          title="Life Coaching"
          duration="90 - 120 min"
          actionText="View Session"
          classNames="mb-8"
          onAction={() => alert('View Session clicked')}
        />

        <div className="space-y-4">
          <Button
            className="w-full bg-emerald-green border-emerald-green text-white"
            variant={'outline'}
          >
            Book More Coaching
          </Button>

          <Button onClick={selectCoach} className="w-full" variant={'outline'}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </CoachingInfoHeader>
  );
};

export default BookingConfirmedPage;
