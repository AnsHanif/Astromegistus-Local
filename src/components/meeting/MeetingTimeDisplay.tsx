'use client';

import { format, parseISO } from 'date-fns';
import { Clock } from 'lucide-react';

interface MeetingTimeDisplayProps {
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  className?: string;
}

export default function MeetingTimeDisplay({
  selectedDate,
  selectedTime,
  timezone,
  className = '',
}: MeetingTimeDisplayProps) {
  const formatDateTime = (
    selectedDate: string | undefined,
    selectedTime: string | undefined,
    timezone: string | undefined
  ) => {
    if (!selectedDate || !selectedTime) {
      return 'Invalid Date';
    }

    try {
      // Parse the selected date (ISO string)
      const dateObj = parseISO(selectedDate);

      // Parse time (12-hour format)
      const timeStr = selectedTime.trim();
      const isPM = timeStr.includes('PM');
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);

      if (!timeMatch) return 'Invalid Time';

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
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        hours,
        minutes
      );

      // Format with date-fns
      const formattedDate = format(meetingDateTime, 'MMM d, yyyy');
      const formattedTime = format(meetingDateTime, 'h:mm a');

      return `${formattedDate} at ${formattedTime}${timezone ? ` (${timezone})` : ''}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (!selectedDate || !selectedTime) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-2 text-sm text-golden-glow ${className}`}
    >
      <Clock className="h-4 w-4" />
      <span>
        Meeting: {formatDateTime(selectedDate, selectedTime, timezone)}
      </span>
    </div>
  );
}
