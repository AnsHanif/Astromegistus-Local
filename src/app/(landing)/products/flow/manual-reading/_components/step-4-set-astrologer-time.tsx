import React, { FC, useState, useEffect } from 'react';
import moment from 'moment';
import { ManualReading } from './manual-reading.interfaces';
import { Button } from '@/components/ui/button';
import CustomCalendar from '@/components/common/custom-calendar/custom-calendar';
import { useBooking } from '../../_components/booking-context';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { useCreateBooking } from '@/hooks/mutation/booking-mutation/booking-mutation';
import { useAvailableSlots } from '@/hooks/query/booking-queries';
import { TIMEZONES, getUserTimezone } from '@/constants/timezones';
import { CustomSelect } from '@/components/common/custom-select/custom-select';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Step4SetAstrologerTimeProps extends ManualReading {}

const Step4SetAstrologerTime: FC<Step4SetAstrologerTimeProps> = ({
  onNext,
  onPrev,
}) => {
  // Get booking context to access selected astrologer and create booking
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
  const [selectedTimezone, setSelectedTimezone] = useState<string>(getUserTimezone());

  // Booking mutation (still using old API as it handles person details)
  const { mutateAsync: createBooking, isPending: isCreatingBooking } =
    useCreateBooking();

  // Format date for API call
  const selectedDate = value
    ? moment(value.toString()).format('YYYY-MM-DD')
    : '';

  // Fetch available slots using V2 API (considers product duration and timezone)
  const {
    data: slotsResponse,
    isLoading: isLoadingTimeSlots,
    error: timeSlotsError,
    refetch: refetchTimeSlots,
  } = useAvailableSlots(
    bookingData.selectedProvider || 'cmfmhsrkd0000zcjk94mevel9',
    bookingData.productId, // productId
    undefined, // sessionId
    selectedDate,
    selectedTimezone // Pass selected timezone
  );

  const timeSlots = slotsResponse?.data?.slots || [];
  const displayTimezone = slotsResponse?.data?.timezone || 'UTC';

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

    // Format date and time for API
    const formatDateOfBirth = (day: string, month: string, year: string) => {
      if (!day || !month || !year) return '';
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const formatTimeOfBirth = (
      hour: string,
      minute: string,
      timePeriod: string
    ) => {
      if (!hour || !minute || !timePeriod) return '';
      let formattedHour = parseInt(hour);
      if (timePeriod === 'PM' && formattedHour !== 12) {
        formattedHour += 12;
      } else if (timePeriod === 'AM' && formattedHour === 12) {
        formattedHour = 0;
      }
      return `${formattedHour.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
    };

    // Create booking with all collected data
    const bookingPayload = {
      productId: bookingData.productId,
      type: 'MANUAL' as const,
      persons: [
        {
          fullName: bookingData.fullName,
          dateOfBirth: formatDateOfBirth(
            bookingData.day,
            bookingData.month,
            bookingData.year
          ),
          timeOfBirth: formatTimeOfBirth(
            bookingData.hour,
            bookingData.minute,
            bookingData.timePeriod
          ),
          placeOfBirth: bookingData.birthCountryLabel,
          latitude: bookingData.latitude,
          longitude: bookingData.longitude,
          timezone: bookingData.timezone,
        },
      ],
      // Manual booking specific fields
      providerId: bookingData.selectedProvider ?? '',
      selectedDate: selectedDate,
      selectedTime: selectedSlot.displayStartTime,
      timezone: selectedTimezone,
      itemId: bookingData.itemId,
      // timezone: displayTimezone,
    };

    try {
      await createBooking(bookingPayload);
      onNext?.();
    } catch (error) {
      console.log(error);
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
            className="border-black hover:bg-grey-light-50 h-12 md:max-w-[10rem] w-full px-2"
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

export default Step4SetAstrologerTime;
