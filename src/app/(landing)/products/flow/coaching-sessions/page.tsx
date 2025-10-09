'use client';

import React, { FC, Suspense } from 'react';
import CoachingSessionsPage from './_components/coaching-session-page';
import { BookingProvider } from '../_components/booking-context';
import { useSearchParams } from 'next/navigation';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';

// Component that uses useSearchParams
const CoachingSessionsContent: FC = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || '';

  return (
    <BookingProvider
      initialProductId={productId}
      bookingType="coaching-session"
    >
      <CoachingSessionsPage />
    </BookingProvider>
  );
};

// Main component with Suspense boundary
const CoachingSessions: FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <SpinnerLoader />
        </div>
      }
    >
      <CoachingSessionsContent />
    </Suspense>
  );
};

export default CoachingSessions;
