'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SessionCard from '../../_components/session-card';
import { useRecentSessions } from '@/hooks/query/booking-queries';
import { enqueueSnackbar } from 'notistack';
import SectionLoader from '@/components/common/section-loader';
import { Button } from '@/components/ui/button';
import { Clock, Download, Eye, Radio } from 'lucide-react';
import { SessionData } from '@/services/api/booking-api';
import { useRouter } from 'next/navigation';
import MeetingTimeDisplay from '@/components/meeting/MeetingTimeDisplay';
import { SessionDetailSheet } from './session-detail-sheet';

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
        <SectionLoader
          message="Loading upcoming sessions..."
          className="min-h-[400px]"
          size={40}
          color="#D4AF37"
        />
      </div>
    );
  }

  // Fallback to empty data if there are errors
  const sessions = error ? [] : sessionsData?.data?.sessions || [];
  const totalSessions = error ? 0 : sessionsData?.data?.pagination.total || 0;

  const handleReschedule = (sessionId: string, bookingId: string) => {
    router.push(
      `/products/flow/reschedule?sessionId=${sessionId}&bookingId=${bookingId}&type=coaching`
    );
  };

  const UpcomingSessionCard = ({ session }: { session: SessionData }) => {
    // Check if it's meeting time
    const isMeetingTime = useMemo(() => {
      if (!session.selectedDate || !session.selectedTime) return false;

      try {
        // Parse the selected date (ISO string)
        const dateObj = new Date(session.selectedDate);

        // Extract date parts
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        // Parse time (12-hour format)
        const timeStr = session.selectedTime.trim();
        const isPM = timeStr.includes('PM');
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);

        if (!timeMatch) return false;

        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);

        // Convert to 24-hour format
        if (isPM && hours !== 12) {
          hours += 12;
        } else if (!isPM && hours === 12) {
          hours = 0;
        }

        // Create meeting datetime
        const meetingDateTime = new Date(
          `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
        );

        // Apply timezone offset if provided (simplified for Pacific Time UTC -8)
        if (session.timezone && session.timezone.includes('UTC -8')) {
          meetingDateTime.setHours(meetingDateTime.getHours() + 8);
        }

        const now = new Date();

        // Allow joining 15 minutes before the meeting time
        const meetingStartTime = new Date(
          meetingDateTime.getTime() - 15 * 60 * 1000
        );

        // Allow joining until 2 hours after the meeting time
        const meetingEndTime = new Date(
          meetingDateTime.getTime() + 2 * 60 * 60 * 1000
        );

        return now >= meetingStartTime && now <= meetingEndTime;
      } catch (error) {
        console.error('Error parsing meeting time:', error);
        return false;
      }
    }, [session.selectedDate, session.selectedTime, session.timezone]);
    return (
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
            {/* <span className="animate-spin">↻</span>{' '} */}
            {session.status === 'PENDING' ? 'Preparing' : session.status}
          </span>
        </div>

        <p className="text-sm">Session with {session.clientName}</p>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" /> {session.duration}
        </div>

        {/* Meeting Time Display */}
        <MeetingTimeDisplay
          selectedDate={session.selectedDate}
          selectedTime={session.selectedTime}
          timezone={session.userTimezone}
        />

        <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
          <Button
            className="flex items-center gap-2 flex-1 text-black"
            // disabled={!session.meetingLink || !isMeetingTime}
            onClick={() => {
              if (session.meetingLink && isMeetingTime) {
                window.open(session.meetingLink, '_blank');
              }
            }}
          >
            <Radio />
            {!session.meetingLink
              ? 'Meeting Link Not Available'
              : !isMeetingTime
                ? 'Meeting Not Started Yet'
                : 'Join Session'}
          </Button>

          <Button
            className="flex items-center justify-center gap-2 flex-1 bg-transparent text-golden-glow border border-golden-glow"
            onClick={() => handleReschedule(session.sessionId, session.id)}
          >
            Reschedule
          </Button>
          <SessionDetailSheet
            bookingId={session.id}
            triggerClassName="flex items-center justify-center gap-2 flex-1 bg-transparent text-golden-glow border border-golden-glow hover:bg-golden-glow hover:text-black transition-colors"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="py-10">
      <h1 className="text-size-heading md:text-size-heading font-semibold">
        Upcoming Sessions{' '}
        <span className="text-sm font-medium">({totalSessions})</span>
      </h1>

      {sessions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-400 text-lg">No upcoming sessions found</p>
          <p className="text-gray-500 text-sm mt-2">
            Your scheduled sessions will appear here
          </p>
        </div>
      ) : (
        <div>
          {sessions.map((session: SessionData) => (
            <UpcomingSessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {/* Pagination could be added here if needed */}
      {sessionsData?.data?.pagination &&
        sessionsData.data.pagination.totalPages > 1 && (
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
