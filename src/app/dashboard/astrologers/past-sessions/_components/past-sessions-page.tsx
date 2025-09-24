'use client';
import React from 'react';
import AstrologersDashboardLayout from '../../_components/astrologers-dashboard.layout';
import AstrologersSessionCard from './astrologer-session-card';
import { usePastSessions } from '@/hooks/query/booking-queries';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';

const PastSessionsPage = () => {
  const { data, isLoading, error } = usePastSessions({
    page: 1,
    limit: 10,
  });

  const sessions = data?.data?.sessions || [];

  return (
    <AstrologersDashboardLayout>
      <div className="text-white mt-6 md:mt-8 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <SpinnerLoader size={24} color="#ffffff" className="mr-2" />
            <span>Loading past sessions...</span>
          </div>
        ) : error ? (
          <div className="text-red-400 py-10 text-center">
            Failed to load past sessions. Please try again later.
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-400 py-10 text-center">
            No past sessions found.
          </div>
        ) : (
          sessions.map((session) => (
            <AstrologersSessionCard
              key={session.id}
              name={session.clientName}
              tag="Completed"
              duration={session.duration}
              statusLabel="Completed On"
              statusDate={new Date(
                session.completedAt || session.updatedAt
              ).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZoneName: 'short',
              })}
              earned={session.price ? session.price.toString() : '0'}
            />
          ))
        )}
      </div>
    </AstrologersDashboardLayout>
  );
};

export default PastSessionsPage;
