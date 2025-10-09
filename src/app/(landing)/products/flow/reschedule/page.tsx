'use client';

import React, { Suspense } from 'react';
import ReschedulePage from './_components/reschedule-page';
import { useSearchParams } from 'next/navigation';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';

// Component that uses useSearchParams
const RescheduleContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const bookingId = searchParams.get('bookingId');
  const type = searchParams.get('type');

  // Show loading state while parameters are being resolved
  if (!sessionId || !bookingId) {
    return <div>Session ID and booking ID are required</div>;
  }

  return (
    <ReschedulePage sessionId={sessionId} bookingId={bookingId} type={type} />
  );
};

// Main component with Suspense boundary
const Reschedule = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <SpinnerLoader />
        </div>
      }
    >
      <RescheduleContent />
    </Suspense>
  );
};

export default Reschedule;
