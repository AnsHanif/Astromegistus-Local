import React from 'react';
import CoachingSessionsPage from './_components/coaching-session-page';
import { BookingProvider } from '../_components/booking-context';

const CoachingSessions = () => {
  return (
    <BookingProvider
      initialProductId="cmfqjsl0c0000w6gkcvkltv8a" // You'll need to set this
      bookingType="coaching-session"
    >
      <CoachingSessionsPage />
    </BookingProvider>
  );
};

export default CoachingSessions;
