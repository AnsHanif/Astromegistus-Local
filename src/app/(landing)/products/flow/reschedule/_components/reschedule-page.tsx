'use client';

import React, { useState, useEffect } from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import RescheduleCard from './reshedule-card';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import CustomCalendar from '@/components/common/custom-calendar/custom-calendar';
import moment from 'moment';
import ConfirmResheduleModal from './confirm-reschedule-modal';
import {
  useSessionPreparation,
  useAvailableSlots,
} from '@/hooks/query/booking-queries';
import { useRescheduleBooking } from '@/hooks/mutation/booking-mutation/booking-mutation';
import { enqueueSnackbar } from 'notistack';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { useRouter } from 'next/navigation';
import { TIMEZONES, getUserTimezone } from '@/constants/timezones';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReschedulePageProps {
  sessionId: string;
  bookingId: string;
  type: string | null;
}

const ReschedulePage = ({
  sessionId,
  bookingId,
  type,
}: ReschedulePageProps) => {
  const [selectedSlot, setSelectedSlot] = useState<{
    startDateTimeUTC: string;
    endDateTimeUTC: string;
    displayStartTime: string;
  } | null>(null);
  const [value, onChange] = useState<Value>(new Date());
  const [timezone, setTimezone] = useState(getUserTimezone());
  const [isConfirmReschedule, setIsConfirmReschedule] = useState(false);

  const router = useRouter();

  // Fetch session data
  const {
    data: sessionData,
    isLoading,
    error,
  } = useSessionPreparation(bookingId, type || '');

  console.log('sessionData in reschedule page', sessionData);

  // Reschedule mutation
  const rescheduleBookingMutation = useRescheduleBooking();

  // Get provider ID and product ID from session data
  const providerId = sessionData?.data?.provider?.id;
  // const productId = sessionData?.data?.productId;

  // Format selected date for API call (YYYY-MM-DD)
  const formattedSelectedDate =
    value && !Array.isArray(value)
      ? moment(value).format('YYYY-MM-DD')
      : undefined;

  // Fetch time slots using V2 API (considers product duration and timezone)
  const {
    data: slotsResponse,
    isLoading: isLoadingTimeSlots,
    error: timeSlotsError,
  } = useAvailableSlots(
    providerId,
    type === 'reading' ? sessionId : undefined, // If reading, send productId
    type === 'reading' ? undefined : sessionId, // If reading, sessionId undefined, otherwise send sessionId
    formattedSelectedDate,
    timezone
  );

  const timeSlots = slotsResponse?.data?.slots || [];
  const displayTimezone = slotsResponse?.data?.timezone || 'UTC';

  // Show error toast if session not found
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Failed to load session data', { variant: 'error' });
      router.push('/dashboard/upcoming-sessions');
    }
  }, [error, router]);

  // Reset selected slot when date or timezone changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [formattedSelectedDate, timezone]);

  // Show error toast for time slots if needed
  useEffect(() => {
    if (timeSlotsError) {
      enqueueSnackbar('Failed to load available time slots', {
        variant: 'error',
      });
    }
  }, [timeSlotsError]);

  // Handle reschedule confirmation
  const handleConfirmReschedule = async () => {
    if (!selectedSlot || !value || Array.isArray(value)) {
      enqueueSnackbar('Please select both date and time', { variant: 'error' });
      return;
    }

    try {
      // Use bookingId if available, otherwise fall back to sessionId
      const targetBookingId = bookingId || sessionId;

      await rescheduleBookingMutation.mutateAsync({
        bookingId: targetBookingId,
        data: {
          selectedDate: moment(value).format('YYYY-MM-DD'),
          selectedTime: selectedSlot.displayStartTime,
          timezone: timezone,
          type: type || '',
        },
      });

      setIsConfirmReschedule(false);
      router.back();
    } catch (error) {
      console.error('Reschedule error:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <ProductInfoHeader title="Rescheduling">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-white">
            <SpinnerLoader size={20} color="#ffffff" />
            <span>Loading session data...</span>
          </div>
        </div>
      </ProductInfoHeader>
    );
  }

  // Get session details
  const session = sessionData?.data;
  const currentDate = session?.selectedDate
    ? new Date(session.selectedDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date not set';

  const currentTime = session?.selectedTime
    ? `${session.selectedTime} (${session.session?.duration || 'Duration not set'})`
    : 'Time not set';

  return (
    <ProductInfoHeader title="Rescheduling">
      <div className="flex flex-col gap-6 md:gap-8">
        <RescheduleCard
          title="Current Scheduling"
          name={session?.client?.name || 'Client Name'}
          sessionType={session?.session?.title || 'Session Type'}
          date={currentDate}
          time={currentTime}
          fee={session?.price ? `$${session.price}` : 'Fee not set'}
        />

        <div className="flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
            {/* Left Side - Calendar (dummy for now) */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Pick a Time</h2>
              <div className="w-full flex items-center justify-center">
                <CustomCalendar
                  value={value}
                  onChange={onChange}
                  className={'text-sm md:text-size-secondary'}
                />
              </div>
            </div>

            {/* Right Side - Time Slots + Timezone */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Available Time Slots For{' '}
                {value && !Array.isArray(value)
                  ? moment(value).format('MMMM Do, YYYY')
                  : ''}
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {isLoadingTimeSlots ? (
                  <div className="col-span-2 flex items-center justify-center py-8">
                    <SpinnerLoader size={16} color="#000000" />
                    <span className="ml-2 text-sm">
                      Loading available slots...
                    </span>
                  </div>
                ) : timeSlots.length > 0 ? (
                  timeSlots.map((slot, index) => {
                    const isSelected =
                      selectedSlot?.startDateTimeUTC === slot.startDateTimeUTC;

                    return (
                      <Button
                        variant={'outline'}
                        key={index}
                        onClick={() => {
                          setSelectedSlot({
                            startDateTimeUTC: slot.startDateTimeUTC,
                            endDateTimeUTC: slot.endDateTimeUTC,
                            displayStartTime: slot.displayStartTime,
                          });
                        }}
                        className={`px-4 py-2 border cursor-pointer h-12 md:h-15 text-sm ${
                          isSelected
                            ? 'bg-green-800 text-white border-green-800'
                            : 'border-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {slot.displayStartTime} - {slot.displayEndTime}
                      </Button>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    {providerId && formattedSelectedDate
                      ? 'No available time slots for this date'
                      : 'Please select a date to view available time slots'}
                  </div>
                )}
              </div>

              {/* Timezone Dropdown */}
              <div>
                <label className="block mb-2 md:text-size-medium font-semibold">
                  Timezone
                </label>
                <CustomSelect
                  onSelect={setTimezone}
                  options={TIMEZONES.map((tz) => ({
                    label: tz.label,
                    value: tz.value,
                  }))}
                  size="sm"
                  variant="default"
                  placeholder="Select timezone"
                  selectedValue={timezone}
                  className="w-full h-12 sm:h-15"
                  triggerClassName={`h-12 w-full text-size-secondary sm:h-15 cursor-pointer bg-transparent border-grey focus:border-black hover:border-black text-black`}
                  contentClassName="w-full max-h-60 overflow-y-auto bg-white text-black"
                  chevronClassName="text-black"
                />
              </div>
            </div>
          </div>
        </div>

        <RescheduleCard
          title="New Scheduling"
          name={session?.client?.name || 'Client Name'}
          sessionType={session?.session?.title || 'Session Type'}
          date={
            value && !Array.isArray(value)
              ? value.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Select date'
          }
          time={
            selectedSlot
              ? `${selectedSlot.displayStartTime} (${session?.session?.duration || 'Duration not set'})`
              : 'Select time'
          }
        />

        <Button
          onClick={() => setIsConfirmReschedule(true)}
          disabled={!selectedSlot || !value || Array.isArray(value)}
          className="bg-emerald-green hover:bg-emerald-green/90 text-white max-w-[20rem] w-full mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Rescheduling
        </Button>
      </div>

      <ConfirmResheduleModal
        isOpen={isConfirmReschedule}
        onClose={() => setIsConfirmReschedule(false)}
        onConfirm={handleConfirmReschedule}
        name={session?.provider?.name || 'Provider'}
        currentDate={currentDate}
        currentTime={session?.selectedTime || 'Current time'}
        newDate={
          value && !Array.isArray(value)
            ? value.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'New date'
        }
        newTime={selectedSlot?.displayStartTime || 'New time'}
        isLoading={rescheduleBookingMutation.isPending}
      />
    </ProductInfoHeader>
  );
};

export default ReschedulePage;
