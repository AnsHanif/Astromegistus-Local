import React, { FC, useState, useEffect } from 'react';
import moment from 'moment';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import { Button } from '@/components/ui/button';
import CustomCalendar from '@/components/common/custom-calendar/custom-calendar';
import { useBooking } from '../../_components/booking-context';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { useCreateCoachingBookingV2 } from '@/hooks/mutation/booking-mutation/booking-mutation';
import { useAvailableSlots } from '@/hooks/query/booking-queries';
import { TIMEZONES, getUserTimezone } from '@/constants/timezones';
import { ManualReading } from '../../manual-reading/_components/manual-reading.interfaces';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Step2ScheduleTimeProps extends ManualReading {}

const Step2ScheduleTime: FC<Step2ScheduleTimeProps> = ({ onNext, onPrev }) => {
  // Get booking context to access selected coach and create booking
  const { data: bookingData, updateData } = useBooking();

  const [selectedSlot, setSelectedSlot] = useState<{
    startDateTimeUTC: string;
    endDateTimeUTC: string;
    displayStartTime: string;
  } | null>(null);
  const [value, onChange] = useState<Value>(
    bookingData.selectedDate ? new Date(bookingData.selectedDate) : new Date()
  );
  const [validationError, setValidationError] = useState('');
  const [selectedTimezone, setSelectedTimezone] =
    useState<string>(getUserTimezone());

  // V2 Booking mutation
  const { mutateAsync: createBooking, isPending: isCreatingBooking } =
    useCreateCoachingBookingV2();

  // Format date for API call
  const selectedDate = value
    ? moment(value.toString()).format('YYYY-MM-DD')
    : '';

  // Fetch available slots using V2 API (considers session duration and timezone)
  const {
    data: slotsResponse,
    isLoading: isLoadingTimeSlots,
    error: timeSlotsError,
    refetch: refetchTimeSlots,
  } = useAvailableSlots(
    bookingData.selectedProvider || '',
    undefined, // productId
    bookingData.productId, // sessionId
    selectedDate,
    selectedTimezone // Pass selected timezone
  );

  const timeSlots = slotsResponse?.data?.slots || [];
  const displayTimezone = slotsResponse?.data?.timezone || 'UTC';
  const sessionTitle = slotsResponse?.data?.name;

  // Clear selected slot when date or timezone changes
  useEffect(() => {
    setSelectedSlot(null);
    setValidationError('');
  }, [selectedDate, selectedTimezone]);

  const handleNext = async () => {
    if (!selectedSlot) {
      setValidationError('Please select a time slot to continue');
      return;
    }

    // Store time selection in context for display purposes
    updateData({
      selectedDate: selectedDate,
      selectedTime: selectedSlot.displayStartTime,
      timezone: selectedTimezone,
    });

    // Create V2 booking with UTC timestamps
    const bookingPayload = {
      sessionId: bookingData.productId,
      providerId: bookingData.selectedProvider ?? 'cmfpfe2ig0001w630qqyrmr5x',
      // startDateTimeUTC: selectedSlot.startDateTimeUTC,
      // endDateTimeUTC: selectedSlot.endDateTimeUTC,
      selectedDate: selectedDate,
      selectedTime: selectedSlot.displayStartTime,
      timezone: selectedTimezone,
      itemId: bookingData.itemId,
    };

    try {
      const response = await createBooking(bookingPayload);

      // Store session details in context for confirmation screen
      updateData({
        bookingId: response.data.id,
        sessionTitle: sessionTitle || 'Coaching Session',
        sessionDescription: 'Live coaching session with your selected coach',
        status: 'confirmed',
      });

      onNext?.();
    } catch (error) {
      console.error('Booking creation error:', error);
      // Error is handled by mutation's onError callback
    }

    setValidationError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col justify-evenly md:flex-row gap-10 w-full max-w-5xl">
        {/* Left Side - Calendar */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Pick A Time</h2>
          <div className="w-full flex items-center justify-center">
            <CustomCalendar
              value={value}
              onChange={onChange}
              className={'text-sm md:text-size-secondary'}
            />
          </div>
        </div>

        {/* Right Side - Time Slots */}
        <div className="w-full md:w-1/2">
          <h2 className="text-lg font-semibold mb-4">
            Available Time Slots For{' '}
            {value ? moment(value.toString()).format('MMMM Do, YYYY') : ''}
          </h2>

          {/* Time Slots Display with Fixed Height and Scroll */}
          <div className="h-[400px] overflow-y-auto mb-6">
            {isLoadingTimeSlots ? (
              <div className="flex justify-center items-center h-full">
                <SpinnerLoader />
              </div>
            ) : timeSlotsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">
                  Failed to load time slots. Please try again.
                </p>
                <Button
                  onClick={() => refetchTimeSlots()}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            ) : timeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot, index: number) => {
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
                        setValidationError('');
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
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No time slots available for this date.
                </p>
              </div>
            )}
          </div>

          {/* Timezone Dropdown */}
          <div>
            <label className="block mb-2 md:text-size-medium font-semibold">
              Timezone
            </label>
            <CustomSelect
              onSelect={(value) => {
                setSelectedTimezone(value);
                setValidationError(''); // Clear validation error when selecting
              }}
              options={TIMEZONES.map((tz) => ({
                label: tz.label,
                value: tz.value,
              }))}
              size="sm"
              variant="default"
              placeholder="Select timezone"
              selectedValue={selectedTimezone}
              className="w-full h-12 sm:h-15"
              triggerClassName={`h-12 w-full text-size-secondary sm:h-15 cursor-pointer bg-transparent border-grey focus:border-black hover:border-black`}
              contentClassName="w-full max-h-60 overflow-y-auto"
              chevronClassName="text-black"
            />
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="text-center py-4 col-span-2">
          <p className="text-red-500 text-sm">{validationError}</p>
        </div>
      )}

      <div className="max-w-[55rem] w-full mx-auto">
        <div className="flex flex-col mt-12 w-full md:flex-row self-start gap-4 md:gap-8 col-span-2">
          <Button
            onClick={onPrev}
            variant={'outline'}
            className="border-black h-12 hover:bg-grey-light-50 md:max-w-[10rem] w-full px-2"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant={'outline'}
            className="bg-emerald-green hover:bg-emerald-green/90 h-12 border-emerald-green md:max-w-[10rem] w-full px-2 text-white"
            disabled={isCreatingBooking}
          >
            {isCreatingBooking ? <SpinnerLoader /> : 'Create Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2ScheduleTime;
