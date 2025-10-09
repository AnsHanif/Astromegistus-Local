'use client';

import React from 'react';
import { X, Clock, Calendar, Users, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { TimeSlot } from '@/services/api/timeslot-api';

interface SlotListModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: TimeSlot[];
  selectedDate: string;
  onEditSlot: (slot: TimeSlot) => void;
  onDeleteSlot: (slot: TimeSlot) => void;
  onAddNewSlot: () => void;
}

const SlotListModal: React.FC<SlotListModalProps> = ({
  isOpen,
  onClose,
  slots,
  selectedDate,
  onEditSlot,
  onDeleteSlot,
  onAddNewSlot,
}) => {
  if (!isOpen) return null;

  const formatSelectedDate = () => {
    try {
      return format(new Date(selectedDate), 'EEEE, MMMM d, yyyy');
    } catch {
      return selectedDate;
    }
  };

  const sortedSlots = [...slots].sort((a, b) => {
    // Convert time strings to comparable format
    const parseTime = (timeStr: string | undefined) => {
      if (!timeStr) return 0;
      const match = timeStr.match(/(\d{1,2}):(\d{2}) (AM|PM)/i);
      if (!match) return 0;

      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const ampm = match[3].toUpperCase();

      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;

      return hour * 60 + minute;
    };

    return parseTime(a.time) - parseTime(b.time);
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="p-4 md:p-6 w-full max-w-md backdrop-blur-sm bg-[rgba(33,33,33,1)] rounded-lg max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Time Slots
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {formatSelectedDate()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {sortedSlots.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No time slots for this day</p>
              </div>
            ) : (
              sortedSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="border border-grey rounded-lg p-4 bg-transparent hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-golden-glow" />
                        <span className="text-white font-medium">
                          {slot.time}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            slot.isAvailable
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {slot.isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{slot.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{slot.preparationTime} min prep</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => onEditSlot(slot)}
                        className="p-2 text-gray-400 hover:text-golden-glow hover:bg-white/10 rounded transition-colors"
                        title="Edit slot"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteSlot(slot)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                        title="Delete slot"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onAddNewSlot}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-black rounded font-semibold hover:opacity-90 transition-opacity bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-sm sm:text-base min-h-[44px] touch-manipulation"
            >
              + Add New Slot
            </button>
            <button
              onClick={onClose}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded font-semibold hover:opacity-90 transition-opacity bg-transparent border border-golden-glow text-golden-glow text-sm sm:text-base min-h-[44px] touch-manipulation"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlotListModal;