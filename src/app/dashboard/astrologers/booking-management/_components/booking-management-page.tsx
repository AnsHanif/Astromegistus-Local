'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AstrologersDashboardLayout from '../../_components/astrologers-dashboard.layout';
import { Calendar, Clock, Users, Phone, Square, Briefcase } from 'lucide-react';
import {
  BroadcastingIcon,
  TimerIcon,
  SuccessIcon,
  StartSessionIcon,
  PrepareIcon,
  CalendarIcon,
} from '@/components/assets';
import {
  useBookingStats,
  useRecentSessions,
} from '@/hooks/query/booking-queries';
import { useRescheduleBooking } from '@/hooks/mutation/booking-mutation/booking-mutation';
import { enqueueSnackbar } from 'notistack';
import RescheduleModal from './RescheduleModal';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';

const BookingManagementPage = () => {
  const router = useRouter();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [sessionToReschedule, setSessionToReschedule] = useState<any>(null);

  // Fetch booking statistics and recent sessions
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useBookingStats({});

  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useRecentSessions({ page: 1, limit: 10 });

  // Reschedule mutation
  const rescheduleBookingMutation = useRescheduleBooking();

  const handlePrepareClick = (bookingId?: string) => {
    if (bookingId) {
      router.push(
        `/dashboard/astrologers/session-preparation?bookingId=${bookingId}`
      );
    } else {
      router.push('/dashboard/astrologers/session-preparation');
    }
  };

  const handleStartSessionClick = (bookingId?: string) => {
    if (bookingId) {
      router.push(`/dashboard/astrologers/live-session?bookingId=${bookingId}`);
    } else {
      router.push('/dashboard/astrologers/live-session');
    }
  };

  const handleRescheduleClick = (session: any) => {
    setSessionToReschedule({
      id: session.id,
      clientName: session.clientName,
      sessionTitle: session.sessionTitle,
      duration: session.duration,
      selectedDate: session.selectedDate,
      selectedTime: session.selectedTime,
      timezone: session.timezone,
      notes: session.notes,
    });
    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = async (rescheduleData: {
    selectedDate?: string;
    selectedTime?: string;
    timezone?: string;
  }) => {
    if (!sessionToReschedule) return;

    try {
      await rescheduleBookingMutation.mutateAsync({
        bookingId: sessionToReschedule.id,
        data: rescheduleData,
      });

      setShowRescheduleModal(false);
      setSessionToReschedule(null);
      refetchSessions();
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSessionToReschedule(null);
  };

  // Show error toasts and treat as empty data
  useEffect(() => {
    if (statsError) {
      enqueueSnackbar('Failed to load booking statistics', {
        variant: 'error',
      });
    }
  }, [statsError]);

  useEffect(() => {
    if (sessionsError) {
      enqueueSnackbar('Failed to load recent sessions', { variant: 'error' });
    }
  }, [sessionsError]);

  // Loading state - only show if data is loading and we don't have any data yet
  if ((statsLoading || sessionsLoading) && !statsData && !sessionsData) {
    return (
      <AstrologersDashboardLayout>
        <div className="font-default font-semibold flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-white">
            <SpinnerLoader size={20} color="#ffffff" />
            <span>Loading booking data...</span>
          </div>
        </div>
      </AstrologersDashboardLayout>
    );
  }

  // Fallback to empty data if there are errors
  const stats = statsError
    ? {
        allSessionsToday: 0,
        totalPendingSessions: 0,
        totalCompletedSessions: 0,
      }
    : statsData?.data;
  const sessions = sessionsError ? [] : sessionsData?.data?.sessions || [];

  return (
    <AstrologersDashboardLayout>
      <div className="font-default font-semibold">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8 px-2 md:px-0">
          {/* Today's Sessions */}
          <div className="p-4 md:p-6 text-white h-28 md:h-32 bg-gradient-to-b from-[#010002] to-[#3C0C61]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs md:text-sm font-medium text-white">
                Today's Sessions
              </h3>
              <div className="flex items-center justify-center">
                <BroadcastingIcon width="32" height="32" color="white" />
              </div>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-white">
              {stats?.allSessionsToday ?? 0}
            </div>
          </div>

          {/* Pending Sessions */}
          <div className="p-4 md:p-6 text-white h-28 md:h-32 bg-gradient-to-t from-[#BD841A] to-[#080500]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs md:text-sm font-medium text-white">
                Pending Sessions
              </h3>
              <div className="flex items-center justify-center">
                <TimerIcon width="32" height="32" color="white" />
              </div>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-white">
              {stats?.totalPendingSessions ?? 0}
            </div>
          </div>

          {/* Completed Sessions */}
          <div className="p-4 md:p-6 text-white h-28 md:h-32 bg-gradient-to-t from-[#053A57] to-[#020A0E]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs md:text-sm font-medium text-white">
                Completed Sessions
              </h3>
              <div className="flex items-center justify-center">
                <SuccessIcon width="32" height="32" color="white" />
              </div>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-white">
              {stats?.totalCompletedSessions ?? 0}
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-3 px-2 md:px-0">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">
            Recent Sessions
          </h2>

          {sessions.length === 0 ? (
            <div className="p-6 bg-[#3f3f3f] text-center">
              <p className="text-gray-400">No recent sessions found</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="p-3 md:p-5 bg-[#3f3f3f]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 mb-3 md:mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="text-white font-semibold text-sm md:text-base mb-1">
                        {session.clientName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{session.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{session.sessionTitle}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
                    <span
                      className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium ${
                        session.status === 'PENDING'
                          ? 'bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] text-black'
                          : session.status === 'CONFIRMED'
                            ? 'bg-green-600 text-white'
                            : session.status === 'COMPLETED'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 text-white'
                      }`}
                    >
                      {session.status}
                    </span>
                    <span className="text-gray-400 text-xs md:text-sm">
                      {session.selectedDate && session.selectedTime
                        ? `${new Date(session.selectedDate).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )} at ${session.selectedTime}${session.timezone ? ` (${session.timezone})` : ''}`
                        : new Date(session.createdAt).toLocaleString('en-US', {
                            timeZone: 'UTC',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          }) + ' UTC'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <button
                    onClick={() => handleStartSessionClick(session.id)}
                    className="bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] text-black text-xs md:text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-[220px] h-[60px]"
                  >
                    <StartSessionIcon width="16" height="16" color="black" />
                    Start Session
                  </button>

                  <button
                    onClick={() => handlePrepareClick(session.id)}
                    className="text-white text-xs md:text-sm font-medium transition-colors flex items-center justify-center gap-2 w-[220px] h-[60px] bg-[#093b1d]"
                  >
                    <PrepareIcon width="16" height="16" color="white" />
                    Prepare
                  </button>

                  <button
                    onClick={() => handleRescheduleClick(session)}
                    className="text-xs md:text-sm font-medium transition-colors flex items-center justify-center gap-2 w-[220px] h-[60px] bg-[#3f3f3f] relative overflow-hidden hover:opacity-80"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] p-[1px]">
                      <div className="w-full h-full bg-[#3f3f3f] flex items-center justify-center gap-2">
                        <CalendarIcon
                          width="16"
                          height="16"
                          className="text-transparent bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] bg-clip-text"
                        />
                        <span className="text-transparent bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] bg-clip-text">
                          Reschedule
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={handleCloseRescheduleModal}
        onConfirm={handleConfirmReschedule}
        sessionDetails={sessionToReschedule}
        isLoading={rescheduleBookingMutation.isPending}
      />
    </AstrologersDashboardLayout>
  );
};

export default BookingManagementPage;
