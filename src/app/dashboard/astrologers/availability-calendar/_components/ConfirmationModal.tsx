'use client';

import React from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  classNames: string[];
  extendedProps?: {
    clientName?: string;
    clientAvatar?: string;
  };
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  pendingEvent: CalendarEvent | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  pendingEvent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md text-center bg-[rgba(33,33,33,1)] rounded-lg">
        {/* Success Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <img src="/images/success.png" alt="Success" className="w-24 h-24 sm:w-32 sm:h-32" />
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Confirm Rescheduling</h3>
        
        <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8 px-2">
          Your Session Has Been Successfully Rescheduled To{' '}
          {pendingEvent && new Date(pendingEvent.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-black rounded font-semibold hover:opacity-90 transition-opacity bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-sm sm:text-base min-h-[44px] touch-manipulation"
          >
            Confirm Reschedule
          </button>
          <button
            onClick={onCancel}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded font-semibold hover:opacity-90 transition-opacity bg-transparent border border-golden-glow text-golden-glow text-sm sm:text-base min-h-[44px] touch-manipulation"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;