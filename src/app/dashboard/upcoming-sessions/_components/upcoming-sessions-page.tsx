'use client';

import React, { useState, useEffect } from 'react';
import SessionCard from '../../_components/session-card';
import { useRecentSessions } from '@/hooks/query/booking-queries';
import { enqueueSnackbar } from 'notistack';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { Button } from '@/components/ui/button';
import { Clock, Download, Eye, Radio } from 'lucide-react';
import { SessionData } from '@/services/api/booking-api';
import { useRouter } from 'next/navigation';

export default function UpcomingSessionsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const router = useRouter();

  const {
    data: sessionsData,
    isLoading,
    error,
  } = useRecentSessions({ page, limit });

  // Show error toast and treat as empty data
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Failed to load upcoming sessions', {
        variant: 'error',
      });
    }
  }, [error]);

  // Loading state - only show if data is loading and we don't have any data yet
  if (isLoading && !sessionsData) {
    return (
      <div className="py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-white">
            <SpinnerLoader size={20} color="#ffffff" />
            <span>Loading upcoming sessions...</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to empty data if there are errors
  const sessions = error ? [] : sessionsData?.data?.sessions || [];
  const totalSessions = error ? 0 : sessionsData?.data?.pagination.total || 0;

  const handleReschedule = (sessionId: string) => {
    router.push(`/products/flow/reschedule/${sessionId}`);
  };

  const UpcomingSessionCard = ({ session }: { session: SessionData }) => (
    <div className="my-4 py-6 px-4 sm:px-8 bg-[var(--bg)] text-white shadow-lg flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="md:text-size-large font-semibold">
            {session.sessionTitle}
          </h2>
          <span className="text-sm font-normal px-4 py-1.5 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black w-fit">
            {session.category}
          </span>
        </div>
        <span className="text-sm font-normal px-4 py-1.5 bg-gradient-to-r from-[#7B3470] to-[#E19D45] flex items-center gap-2 w-fit">
          <span className="animate-spin">↻</span> {session.status === 'PENDING' ? 'Preparing' : session.status}
        </span>
      </div>

      <p className="text-sm">Session with {session.clientName}</p>

      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4" /> {session.duration}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between text-sm max-w-lg">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4" /> Scheduled
        </div>
        <span>
          {session.selectedDate && session.selectedTime
            ? `${new Date(session.selectedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })} at ${session.selectedTime}${session.timezone ? ` (${session.timezone})` : ''}`
            : new Date(session.createdAt).toLocaleString('en-US', {
                timeZone: 'UTC',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }) + ' UTC'
          }
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
        <Button 
          className="flex items-center gap-2 flex-1 text-black" 
          disabled={session.status === 'PENDING'}
        >
          <Radio /> Join Session
        </Button>

        <Button 
          className="flex items-center justify-center gap-2 flex-1 bg-transparent text-golden-glow border border-golden-glow"
          onClick={() => handleReschedule(session.id)}
        >
          Reschedule
        </Button>
      </div>
    </div>
  );

  return (
    <div className="py-10">
      <h1 className="text-size-heading md:text-size-heading font-semibold">
        Upcoming Sessions <span className="text-sm font-medium">({totalSessions})</span>
      </h1>

      {sessions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-400 text-lg">No upcoming sessions found</p>
          <p className="text-gray-500 text-sm mt-2">Your scheduled sessions will appear here</p>
        </div>
      ) : (
        <div>
          {sessions.map((session: SessionData) => (
            <UpcomingSessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {/* Pagination could be added here if needed */}
      {sessionsData?.data?.pagination && sessionsData.data.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-white">
            Page {page} of {sessionsData.data.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === sessionsData.data.pagination.totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
