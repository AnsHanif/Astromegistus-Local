'use client';

import React from 'react';
import { X, Clock, User, Calendar as CalendarIcon, Video } from 'lucide-react';
import { TimeSlot } from '@/services/api/timeslot-api';

interface BookedSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: TimeSlot[];
  selectedDate: string; // YYYY-MM-DD format
}

const BookedSlotsModal: React.FC<BookedSlotsModalProps> = ({
  isOpen,
  onClose,
  slots,
  selectedDate,
}) => {
  if (!isOpen) return null;

  // Format date for display
  const dateObj = new Date(selectedDate + 'T00:00:00');
  const displayDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-graphite rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-graphite border-b border-gray-700 p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Booked Slots
            </h2>
            <p className="text-sm text-gray-400 mt-1">{displayDate}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {slots.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No booked slots for this day
            </p>
          ) : (
            slots.map((slot, index) => {
              const isProductBooking = !!slot.booking;
              const isCoachingBooking = !!slot.coachingBooking;

              return (
                <div
                  key={slot.id}
                  className="border border-gray-700 rounded-lg p-4 hover:border-golden-glow transition-colors"
                >
                  {/* Slot Number */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-golden-glow via-pink-shade to-bronze flex items-center justify-center text-black font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {isProductBooking && slot.booking?.product.name}
                          {isCoachingBooking && slot.coachingBooking?.session.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {isProductBooking && 'Product Booking'}
                          {isCoachingBooking && 'Coaching Session'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        (isProductBooking && slot.booking?.status === 'CONFIRMED') ||
                        (isCoachingBooking && slot.coachingBooking?.status === 'CONFIRMED')
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}
                    >
                      {isProductBooking && slot.booking?.status}
                      {isCoachingBooking && slot.coachingBooking?.status}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      {slot.localStartTime} - {slot.localEndTime}
                      <span className="text-xs text-gray-500 ml-2">
                        ({slot.displayTimezone?.split('/').pop() || 'UTC'})
                      </span>
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-300">
                        {isProductBooking && slot.booking?.user.name}
                        {isCoachingBooking && slot.coachingBooking?.user.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {isProductBooking && slot.booking?.user.email}
                        {isCoachingBooking && slot.coachingBooking?.user.email}
                      </span>
                    </div>
                  </div>

                  {/* Booking ID */}
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 font-mono">
                      {slot.bookingId || slot.coachingBookingId}
                    </span>
                  </div>

                  {/* UTC Time Reference */}
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500">
                      UTC: {slot.startDateTimeUTC && new Date(slot.startDateTimeUTC).toUTCString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-graphite border-t border-gray-700 p-4 sm:p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black rounded font-semibold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookedSlotsModal;
