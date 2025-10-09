import React from 'react';
import ManualReadingPage from './_components/manual-reading-page';
import { BookingProvider } from '../_components/booking-context';
// import { useSearchParams } from 'next/navigation';

const ManualReading = () => {
  // const searchParams = useSearchParams();
  // const productId = searchParams.get('productId') || '';

  return (
    <BookingProvider
      initialProductId={''}
      bookingType="manual-reading"
    >
      <ManualReadingPage />
    </BookingProvider>
  );
};

export default ManualReading;
