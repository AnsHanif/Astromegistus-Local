'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import FullScreenLoader from '@/components/common/full-screen-loader';

interface SessionDetails {
  id: string;
  clientName: string;
  sessionTitle: string;
  duration: string;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  notes?: string;
}

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rescheduleData: {
    selectedDate?: string;
    selectedTime?: string;
    timezone?: string;
  }) => void;
  sessionDetails: SessionDetails | null;
  isLoading?: boolean;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sessionDetails,
  isLoading = false,
}) => {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newTimezone, setNewTimezone] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen || !sessionDetails) return null;

  const getCurrentDateTime = () => {
    if (sessionDetails.selectedDate && sessionDetails.selectedTime) {
      const date = new Date(sessionDetails.selectedDate);
      return {
        date: date.toLocaleDateString(),
        time: sessionDetails.selectedTime,
        timezone: sessionDetails.timezone || 'UTC',
      };
    }
    return {
      date: 'Not scheduled',
      time: 'Not scheduled',
      timezone: 'UTC',
    };
  };

  const currentDateTime = getCurrentDateTime();

  const handleReschedule = () => {
    if (!newDate || !newTime) return;
    setShowConfirmation(true);
  };

  const handleConfirmReschedule = () => {
    const rescheduleData: {
      selectedDate?: string;
      selectedTime?: string;
      timezone?: string;
    } = {};
    if (newDate) rescheduleData.selectedDate = newDate;
    if (newTime) rescheduleData.selectedTime = newTime;
    if (newTimezone) rescheduleData.timezone = newTimezone;

    onConfirm(rescheduleData);
    setShowConfirmation(false);
    setNewDate('');
    setNewTime('');
    setNewTimezone('');
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setNewDate('');
    setNewTime('');
    setNewTimezone('');
    onClose();
  };

  return (
    <>
      <FullScreenLoader loading={isLoading} />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="p-4 md:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg backdrop-blur-sm bg-[rgba(33,33,33,1)] rounded-lg">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Reschedule Session
            </h3>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!showConfirmation ? (
            <>
              {/* Current Session Details */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-3">
                  Current Session Details
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>
                    <span className="text-gray-400">Client:</span>{' '}
                    {sessionDetails.clientName}
                  </div>
                  <div>
                    <span className="text-gray-400">Session:</span>{' '}
                    {sessionDetails.sessionTitle}
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>{' '}
                    {sessionDetails.duration}
                  </div>
                  <div>
                    <span className="text-gray-400">Current Date:</span>{' '}
                    {currentDateTime.date}
                  </div>
                  <div>
                    <span className="text-gray-400">Current Time:</span>{' '}
                    {currentDateTime.time}
                  </div>
                  <div>
                    <span className="text-gray-400">Timezone:</span>{' '}
                    {currentDateTime.timezone}
                  </div>
                </div>
              </div>

              {/* New Date and Time Selection */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded text-white text-sm focus:outline-none border border-grey bg-transparent touch-manipulation [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded text-white text-sm focus:outline-none [color-scheme:dark] border border-grey bg-transparent touch-manipulation [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Timezone (Optional)
                  </label>
                  <input
                    type="text"
                    value={newTimezone}
                    onChange={(e) => setNewTimezone(e.target.value)}
                    placeholder="e.g., UTC, EST, PST"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded text-white text-sm focus:outline-none border border-grey bg-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6 sm:mt-8">
                <button
                  onClick={handleReschedule}
                  disabled={isLoading || !newDate || !newTime}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-black rounded font-semibold hover:opacity-90 transition-opacity bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded font-semibold hover:opacity-90 transition-opacity bg-transparent border border-golden-glow text-golden-glow text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Confirmation Modal */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-4">
                  Confirm Reschedule
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-gray-800/50 rounded">
                    <div className="text-gray-400 mb-1">From:</div>
                    <div className="text-white">
                      {currentDateTime.date} at {currentDateTime.time}
                    </div>
                  </div>
                  <div className="p-3 bg-green-900/30 border border-green-700/50 rounded">
                    <div className="text-gray-400 mb-1">To:</div>
                    <div className="text-white">
                      {new Date(newDate).toLocaleDateString()} at {newTime}
                      {newTimezone ? ` (${newTimezone})` : ''}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-4">
                  Are you sure you want to reschedule this session? The client
                  will be notified of the change.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmReschedule}
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-black rounded font-semibold hover:opacity-90 transition-opacity bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Rescheduling...' : 'Yes, Reschedule'}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded font-semibold hover:opacity-90 transition-opacity bg-transparent border border-golden-glow text-golden-glow text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Go Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RescheduleModal;
