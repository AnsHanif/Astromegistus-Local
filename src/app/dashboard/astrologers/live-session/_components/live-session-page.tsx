'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionPreparation } from '@/hooks/query/booking-queries';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';

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
  } = useSessionPreparation(bookingId || '', !!bookingId);

  // Countdown effect
  useEffect(() => {
    if (!sessionData?.data?.selectedDate || !sessionData?.data?.selectedTime)
      return;

    const interval = setInterval(() => {
      const now = new Date();

      // Extract date part from selectedDate (which comes as full datetime)
      const dateStr = sessionData?.data?.selectedDate?.split('T')[0]; // Gets "2025-09-18"
      const timeStr = sessionData?.data?.selectedTime; // Gets "22:40"

      // Combine properly: YYYY-MM-DD + T + HH:MM
      const scheduledTime = new Date(`${dateStr}T${timeStr}:00`);
      console.log('Scheduled time:', scheduledTime);
      console.log('Current time:', now);

      const timeDiff = scheduledTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setCountdown('0:00');
        setSessionStatus('ready');
        clearInterval(interval);
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        if (hours > 0) {
          setCountdown(
            `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          );
        } else {
          setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
        setSessionStatus('waiting');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionData]);

  const handleBack = () => {
    router.back();
  };

  const handleStartSession = () => {
    setSessionStatus('started');
    // In a real app, this would connect to video calling service
    console.log('Starting live session...');
    alert('Live session started! Client will be notified to join.');
  };

  const handleSaveNotes = () => {
    if (bookingId && sessionNotes.trim()) {
      // TODO: Integrate with API to save notes to the booking
      // For now, save to localStorage as fallback
      localStorage.setItem(`liveSessionNotes_${bookingId}`, sessionNotes);
    } else {
      localStorage.setItem('liveSessionNotes', sessionNotes);
    }
    console.log('Session notes saved:', sessionNotes);
    alert('Session notes saved successfully!');
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
                Session Starts Soon
              </h2>
              <p className="text-xl mb-3">Countdown: {countdown}</p>
              <p className="text-base text-gray-300 px-4">
                Client will join automatically when the session begins
              </p>
            </>
          )}
          {sessionStatus === 'ready' && (
            <>
              <h2 className="text-2xl sm:text-3xl mb-4 font-semibold text-green-400">
                Session Ready to Start
              </h2>
              <p className="text-xl mb-3">Time: {countdown}</p>
              <p className="text-base text-gray-300 px-4">
                You can start the session now
              </p>
            </>
          )}
          {sessionStatus === 'started' && (
            <>
              <h2 className="text-2xl sm:text-3xl mb-4 font-semibold text-blue-400">
                Session in Progress
              </h2>
              <p className="text-base text-gray-300 px-4">
                Session is now live with the client
              </p>
            </>
          )}
        </div>

        {/* Start Session Button */}
        <div className="mb-12">
          {sessionStatus === 'started' ? (
            <Button
              disabled
              className="text-gray-400 font-semibold border-0 text-base bg-gray-600 w-full max-w-sm h-[60px] cursor-not-allowed"
            >
              Session in Progress
            </Button>
          ) : (
            <Button
              onClick={handleStartSession}
              disabled={sessionStatus === 'waiting'}
              className={`text-black font-semibold border-0 text-base w-full max-w-sm h-[60px] ${
                sessionStatus === 'waiting'
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-golden-glow via-pink-shade to-bronze hover:opacity-90'
              }`}
            >
              {sessionStatus === 'ready'
                ? 'Start Session Now'
                : `Starts in ${countdown}`}
            </Button>
          )}
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
            className="text-black font-semibold border-0 text-base bg-gradient-to-r from-golden-glow via-pink-shade to-bronze w-full max-w-sm h-[60px]"
          >
            Save Notes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionPage;
