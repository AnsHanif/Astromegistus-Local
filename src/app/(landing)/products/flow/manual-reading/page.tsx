import React from 'react';
import ManualReadingPage from './_components/manual-reading-page';
import { BookingProvider } from '../_components/booking-context';

const ManualReading = () => {
  return (
    <BookingProvider
      initialProductId="cmfrrdwxd0000w6pwddlcmal6"
      bookingType="manual-reading"
    >
      <ManualReadingPage />
    </BookingProvider>
  );
};

export default ManualReading;
