import React from 'react';
import SessionPreparationPage from './_components/session-preparation-page';

interface SessionPreparationProps {
  searchParams: Promise<{ bookingId?: string }>;
}

const SessionPreparation = async ({ searchParams }: SessionPreparationProps) => {
  const resolvedSearchParams = await searchParams;
  const bookingId = resolvedSearchParams.bookingId;
  
  return <SessionPreparationPage bookingId={bookingId} />;
};

export default SessionPreparation;