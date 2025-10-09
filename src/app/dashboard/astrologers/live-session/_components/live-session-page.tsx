'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionPreparation } from '@/hooks/query/booking-queries';
import { useSavePreparationNotes } from '@/hooks/mutation/booking-mutation/booking-mutation';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import MeetingTimeDisplay from '@/components/meeting/MeetingTimeDisplay';
import { Save } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';

interface LiveSessionPageProps {
  bookingId?: string;
}

const LiveSessionPage = ({ bookingId }: LiveSessionPageProps) => {
  const router = useRouter();

  const [sessionNotes, setSessionNotes] = useState('');
  const [countdown, setCountdown] = useState('0:00');
  const [sessionStatus, setSessionStatus] = useState('waiting'); // 'waiting', 'ready', 'started', 'ended'

  // Fetch session data if bookingId is available
  const {
    data: sessionData,
    isLoading,
    error,
  } = useSessionPreparation(bookingId || '', undefined, !!bookingId);

  // Save notes mutation
  const saveNotesMutation = useSavePreparationNotes();

  // Load existing notes from session data
  useEffect(() => {
    if (sessionData?.data?.notes) {
      setSessionNotes(sessionData.data.notes);
    }
  }, [sessionData]);

  // Check if it's meeting time (when scheduled time is reached)
  const isMeetingTime = useMemo(() => {
    if (!sessionData?.data?.selectedDate || !sessionData?.data?.selectedTime)
      return false;

    try {
      // Parse the selected date (ISO string)
      const dateObj = new Date(sessionData.data.selectedDate);

      // Extract date parts
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');

      // Parse time (12-hour format)
      const timeStr = sessionData.data.selectedTime.trim();
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
      if (
        sessionData.data.timezone &&
        sessionData.data.timezone.includes('UTC -8')
      ) {
        meetingDateTime.setHours(meetingDateTime.getHours() + 8);
      }

      const now = new Date();

      // Meeting is ready when scheduled time is reached
      return now >= meetingDateTime;
    } catch (error) {
      console.error('Error parsing meeting time:', error);
      return false;
    }
  }, [
    sessionData?.data?.selectedDate,
    sessionData?.data?.selectedTime,
    sessionData?.data?.timezone,
  ]);

  // Countdown effect
  useEffect(() => {
    if (!sessionData?.data?.selectedDate || !sessionData?.data?.selectedTime)
      return;

    const interval = setInterval(() => {
      const now = new Date();

      try {
        // Parse the selected date (ISO string)
        const dateObj = new Date(sessionData.data.selectedDate!);

        // Extract date parts
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        // Parse time (12-hour format like "5:00 PM")
        const timeStr = sessionData.data.selectedTime?.trim() || '';
        const isPM = timeStr.includes('PM');
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);

        if (!timeMatch) {
          setCountdown('Invalid Time');
          return;
        }

        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);

        // Convert to 24-hour format
        if (isPM && hours !== 12) {
          hours += 12;
        } else if (!isPM && hours === 12) {
          hours = 0;
        }

        // Create meeting datetime
        const scheduledTime = new Date(
          `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
        );

        // Apply timezone offset if provided (simplified for Pacific Time UTC -8)
        if (
          sessionData.data.timezone &&
          sessionData.data.timezone.includes('UTC -8')
        ) {
          scheduledTime.setHours(scheduledTime.getHours() + 8);
        }

        console.log('Scheduled time:', scheduledTime);
        console.log('Current time:', now);

        const timeDiff = scheduledTime.getTime() - now.getTime();

        if (timeDiff <= 0) {
          setCountdown('0:00');
          setSessionStatus('ready');
          clearInterval(interval);
        } else {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          if (days > 0) {
            setCountdown(
              `${days}d ${hours}h ${minutes}m ${seconds}s`
            );
          } else if (hours > 0) {
            setCountdown(
              `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
          } else {
            setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
          }
          setSessionStatus('waiting');
        }
      } catch (error) {
        console.error('Error parsing time for countdown:', error);
        setCountdown('Error');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionData]);

  const handleBack = () => {
    router.back();
  };

  const handleJoinMeeting = () => {
    if (sessionData?.data?.meetingLink) {
      // Open meeting link in new tab
      window.open(sessionData.data.meetingLink, '_blank');
    } else {
      alert('Meeting link not available');
    }
  };

  const handleSaveNotes = async () => {
    if (!bookingId) {
      enqueueSnackbar('No booking ID available', { variant: 'error' });
      return;
    }

    try {
      await saveNotesMutation.mutateAsync({
        bookingId,
        data: { notes: sessionNotes },
      });
      // Success notification is handled by the mutation
    } catch (error) {
      console.error('Failed to save notes:', error);
      // Error notification is handled by the mutation
    }
  };

  // Loading state
  if (isLoading && bookingId) {
    return (
      <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-white">
            <SpinnerLoader size={20} color="#ffffff" />
            <span>Loading session data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Get session details
  const clientName = sessionData?.data?.client?.name || 'Client';
  const sessionTitle = sessionData?.data?.session?.title || 'Session';
  const hasScheduledTime =
    sessionData?.data?.selectedDate && sessionData?.data?.selectedTime;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 sm:mb-10">
        <ArrowLeft
          className="w-5 h-5 cursor-pointer hover:text-gray-300"
          onClick={handleBack}
        />
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Live Session
          </h1>
          <p className="text-sm text-white mt-1">
            {sessionTitle} with {clientName}
          </p>
          {hasScheduledTime && (
            <p className="text-xs text-gray-400 mt-1">
              Scheduled:{' '}
              {new Date(sessionData.data.selectedDate!).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }
              )}{' '}
              at {sessionData.data.selectedTime}
              {sessionData.data.timezone && ` (${sessionData.data.timezone})`}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto text-center">
        {/* Clock Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-golden-glow via-pink-shade to-bronze">
            <img
              src="/images/clock.png"
              alt="Clock"
              className="w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>
        </div>

        {/* Session Status */}
        <div className="mb-8">
          {sessionStatus === 'waiting' && (
            <>
              <h2 className="text-2xl sm:text-3xl mb-4 font-semibold">
                Meeting Starts Soon
              </h2>
              <p className="text-xl mb-3">Countdown: {countdown}</p>
              <p className="text-base text-gray-300 px-4">
                The join button will be enabled when the scheduled time arrives
              </p>
            </>
          )}
          {sessionStatus === 'ready' && (
            <>
              <h2 className="text-2xl sm:text-3xl mb-4 font-semibold text-green-400">
                Meeting Ready to Join
              </h2>
              <p className="text-xl mb-3 text-green-400">It's time!</p>
              <p className="text-base text-gray-300 px-4">
                You can now join the meeting with your client
              </p>
            </>
          )}
        </div>

        {/* Join Meeting Button */}
        <div className="mb-12">
          <Button
            onClick={handleJoinMeeting}
            disabled={sessionStatus === 'waiting'}
            className={`text-black font-semibold border-0 text-base w-full max-w-sm h-[60px] ${
              sessionStatus === 'waiting'
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-golden-glow via-pink-shade to-bronze hover:opacity-90'
            }`}
          >
            {sessionStatus === 'ready'
              ? 'Join Meeting'
              : `Starts in ${countdown}`}
          </Button>
        </div>
      </div>

      {/* Session Notes */}
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Session Notes</h3>
        </div>

        <div className="p-[1px] bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] mb-8">
          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Take notes during the session..."
            rows={10}
            className="w-full px-4 py-4 text-white text-base resize-none bg-[#3f3f3f] focus:outline-none border-0 block h-[211px]"
          />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSaveNotes}
            disabled={saveNotesMutation.isPending}
            className="text-black font-semibold border-0 text-base bg-gradient-to-r from-golden-glow via-pink-shade to-bronze w-full max-w-sm h-[60px] disabled:opacity-50"
          >
            {saveNotesMutation.isPending ? (
              <>
                <SpinnerLoader size={16} color="#000000" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Notes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionPage;
