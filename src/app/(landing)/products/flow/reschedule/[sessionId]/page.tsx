import React from 'react';
import ReschedulePage from './_components/reschedule-page';

interface RescheduleProps {
  params: Promise<{
    sessionId: string;
  }>;
}

const Reschedule = async ({ params }: RescheduleProps) => {
  const { sessionId } = await params;
  return <ReschedulePage sessionId={sessionId} />;
};

export default Reschedule;
