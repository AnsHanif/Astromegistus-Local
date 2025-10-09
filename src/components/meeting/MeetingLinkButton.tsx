'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoCallService } from '@/services/videoCallService';
import { Copy, ExternalLink, Video } from 'lucide-react';

interface MeetingLinkButtonProps {
  bookingId: string;
  bookingType: 'booking' | 'coaching';
  onMeetingLinkGenerated?: (meetingLink: string, videoCallId: string) => void;
  className?: string;
}

export default function MeetingLinkButton({
  bookingId,
  bookingType,
  onMeetingLinkGenerated,
  className = '',
}: MeetingLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [videoCallId, setVideoCallId] = useState<string | null>(null);
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

      if (onMeetingLinkGenerated) {
        onMeetingLinkGenerated(result.meetingLink, result.videoCallId);
      }
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

  const copyToClipboard = async () => {
    if (meetingLink) {
      try {
        await navigator.clipboard.writeText(meetingLink);
        // You could add a toast notification here
        console.log('Meeting link copied to clipboard');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  const openMeeting = () => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  };

  if (error) {
    return (
      <div className={`text-red-600 text-sm ${className}`}>
        <p>❌ {error}</p>
        <Button
          onClick={generateMeetingLink}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (meetingLink) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center space-x-2">
          <Button
            onClick={openMeeting}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
          >
            <Video className="w-4 h-4 mr-2" />
            Join Meeting
          </Button>
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded break-all">
          {meetingLink}
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={generateMeetingLink}
      disabled={isLoading}
      className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
      size="sm"
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Generating...
        </>
      ) : (
        <>
          <Video className="w-4 h-4 mr-2" />
          Generate Meeting Link
        </>
      )}
    </Button>
  );
}
