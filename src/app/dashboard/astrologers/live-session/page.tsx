import React from 'react';
import LiveSessionPage from './_components/live-session-page';

interface LiveSessionProps {
  searchParams: Promise<{ bookingId?: string }>;
}

const LiveSession = async ({ searchParams }: LiveSessionProps) => {
  const resolvedSearchParams = await searchParams;
  const bookingId = resolvedSearchParams.bookingId;
  
  return <LiveSessionPage bookingId={bookingId} />;
};

export default LiveSession;