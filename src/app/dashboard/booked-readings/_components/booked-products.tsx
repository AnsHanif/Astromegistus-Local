'use client';
import { JSX, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, Download, Eye, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MeetingTimeDisplay from '@/components/meeting/MeetingTimeDisplay';
import { ReadingDetailSheet } from './reading-detail-sheet';

interface BookedProductsProps {
  image: string;
  title: string;
  tag: string;
  description: string;
  duration: string;
  classNames?: string;
  type: string;
  // Add meeting link fields
  meetingLink?: string;
  meetingId?: string;
  meetingStatus?: string;
  // Add time fields for meeting
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  // Add booking ID for details
  bookingId: string;
  // Add reschedule functionality
  sessionId: string;
  onReschedule: (sessionId: string, bookingId: string) => void;
}

export default function BookedProducts({
  image,
  title,
  tag,
  description,
  duration,
  classNames,
  type,
  meetingLink,
  meetingId,
  meetingStatus,
  selectedDate,
  selectedTime,
  timezone,
  bookingId,
  sessionId,
  onReschedule,
}: BookedProductsProps): JSX.Element {
  const router = useRouter();
  // Check if it's meeting time
  const isMeetingTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return false;

    try {
      // Parse the selected date (already ISO string)
      const dateObj = new Date(selectedDate);

      // Extract date parts
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');

      // Parse time (12-hour format)
      const timeStr = selectedTime.trim();
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

      // Apply timezone offset if provided
      if (timezone && timezone.includes('UTC -8')) {
        // Pacific Time (UTC -8)
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
  }, [selectedDate, selectedTime, timezone]);

  return (
    <div
      className={`w-full h-full max-w-[500px] bg-[var(--bg)] text-white p-3 pb-4 overflow-hidden flex flex-col ${classNames}`}
    >
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="p-2 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-size-large font-semibold">{title}</h2>
          <span
            className={`text-sm font-normal px-4 py-1.5 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black`}
          >
            {tag}
          </span>
        </div>

        <p className="text-justify text-sm mb-4 flex-grow">{description}</p>

        <div className="flex items-start text-sm mb-4">
          <span className="mr-2 mt-0.5">
            <Clock className="w-4 h-4" />
          </span>
          {duration}
        </div>

        {/* Meeting Time Display */}
        {type === 'live' && (
          <MeetingTimeDisplay
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            timezone={timezone}
          />
        )}

        {type === 'reading' && (
          <div className="mt-24 md:mt-40 flex flex-col sm:flex-row gap-5">
            <Button
              className="flex items-center justify-center gap-2 flex-1 bg-transparent text-golden-glow border border-golden-glow hover:bg-golden-glow hover:text-black transition-colors px-2"
              onClick={() =>
                router.push('/dashboard/view-reading?type=reading')
              }
            >
              <Eye className="h-5 w-5" /> View Reading
            </Button>

            <Button className="flex items-center justify-center gap-2 flex-1 text-black px-2">
              <Download className="h-5 w-5" /> Download PDF
            </Button>
          </div>
        )}

        {type === 'live' && (
          <div className="mt-24 md:mt-40 flex flex-col sm:flex-row gap-5">
            <Button
              className="flex items-center justify-center gap-2 flex-1 text-black"
              disabled={!meetingLink || !isMeetingTime}
              onClick={() => {
                if (meetingLink && isMeetingTime) {
                  window.open(meetingLink, '_blank');
                }
              }}
            >
              <Radio className="h-5 w-5" />
              {!meetingLink
                ? 'Meeting Link Not Available'
                : !isMeetingTime
                  ? 'Meeting Not Started Yet'
                  : 'Join Session'}
            </Button>

            <Button
              className="flex items-center justify-center gap-2 flex-1 bg-transparent text-golden-glow border border-golden-glow"
              onClick={() => onReschedule(sessionId, bookingId)}
            >
              Reschedule
            </Button>
          </div>
        )}

        <div className="mt-2 flex flex-col sm:flex-row gap-5">
          <ReadingDetailSheet
            bookingId={bookingId}
            triggerClassName="flex items-center justify-center gap-2 flex-1 bg-transparent text-golden-glow border border-golden-glow px-2 hover:bg-golden-glow hover:text-black transition-colors cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
