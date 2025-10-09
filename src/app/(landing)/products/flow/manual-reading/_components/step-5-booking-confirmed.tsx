import SuccessAnimation from '@/components/common/success-animation';
import React from 'react';
import { useBooking } from '../../_components/booking-context';
import moment from 'moment';

const Step5BookingConfirmed = () => {
  const { data: bookingData } = useBooking();

  // Format date and time for display
  const formatDateTime = () => {
    if (!bookingData.selectedDate || !bookingData.selectedTime) {
      return 'Date and time not available';
    }

    console.log(bookingData);
    const date = moment(bookingData.selectedDate);
    const time = bookingData.selectedTime;
    const timezone = bookingData.timezone || 'UTC';
    console.log('time zone ', timezone);
    
    return `${date.format('MMM DD, YYYY')}, ${time} (${timezone})`;
  };

  // Get product title from context data
  const getProductTitle = () => {
    return bookingData.sessionTitle || 'Manual Reading';
  };

  return (
    <div className="flex flex-col gap-6 mb-36 items-center justify-center max-w-[40rem] w-full mx-auto text-center">
      {/* Success Animation */}
      <SuccessAnimation />

      {/* Heading */}
      <h2 className="text-size-heading md:text-size-primary font-bold">
        Booking Confirmed!
      </h2>

      {/* Subtext */}
      <p className="text-gray-700">
        Your live session has been successfully booked.
      </p>

      {/* Booking Details */}
      <div className="mt-6 w-full text-left max-w-[25rem] mx-auto space-y-3">
        <div className="flex flex-col xs:flex-row justify-between xs:gap-2">
          <span className="font-semibold w-32">Reading Title:</span>
          <span className="text-gray-900">{getProductTitle()}</span>
        </div>

        <div className="flex flex-col xs:flex-row justify-between xs:gap-2">
          <span className="font-semibold w-32">Date &amp; Time:</span>
          <span className="text-gray-900">{formatDateTime()}</span>
        </div>

        <div className="flex flex-col xs:flex-row justify-between xs:gap-2">
          <span className="font-semibold w-32">Astrologer:</span>
          <span className="text-gray-900">
            {bookingData.selectedProviderName || 'Astrologer information not available'}
          </span>
        </div>

        {/* Additional booking details */}
        {bookingData.fullName && (
          <div className="flex flex-col xs:flex-row justify-between xs:gap-2">
            <span className="font-semibold w-32">Client Name:</span>
            <span className="text-gray-900">{bookingData.fullName}</span>
          </div>
        )}

        {bookingData.bookingId && (
          <div className="flex flex-col xs:flex-row justify-between xs:gap-2">
            <span className="font-semibold w-32">Booking ID:</span>
            <span className="text-gray-900 font-mono text-sm">{bookingData.bookingId}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5BookingConfirmed;
