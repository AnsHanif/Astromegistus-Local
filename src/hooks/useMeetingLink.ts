'use client';

import { useState, useEffect } from 'react';
import { VideoCallService } from '@/services/videoCallService';

interface UseMeetingLinkProps {
  bookingId: string;
  bookingType: 'booking' | 'coaching';
}

interface MeetingLinkData {
  meetingLink: string | null;
  videoCallId: string | null;
  isLoading: boolean;
  error: string | null;
  generateMeetingLink: () => Promise<void>;
  getMeetingLink: () => Promise<void>;
}

export function useMeetingLink({
  bookingId,
  bookingType,
}: UseMeetingLinkProps): MeetingLinkData {
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [videoCallId, setVideoCallId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMeetingLink = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let result;
      if (bookingType === 'coaching') {
        result = await VideoCallService.generateCoachingMeetingLink(bookingId);
      } else {
        result = await VideoCallService.generateMeetingLink(bookingId);
      }

      setMeetingLink(result.meetingLink);
      setVideoCallId(result.videoCallId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to generate meeting link';
      setError(message);
      console.error('Error generating meeting link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMeetingLink = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let result;
      if (bookingType === 'coaching') {
        result = await VideoCallService.getCoachingMeetingLink(bookingId);
      } else {
        result = await VideoCallService.getMeetingLink(bookingId);
      }

      if (result.booking?.meetingLink) {
        setMeetingLink(result.booking.meetingLink);
        setVideoCallId(result.booking.meetingId);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to get meeting link';
      setError(message);
      console.error('Error getting meeting link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch existing meeting link on mount
  useEffect(() => {
    if (bookingId) {
      getMeetingLink();
    }
  }, [bookingId]);

  return {
    meetingLink,
    videoCallId,
    isLoading,
    error,
    generateMeetingLink,
    getMeetingLink,
  };
}
