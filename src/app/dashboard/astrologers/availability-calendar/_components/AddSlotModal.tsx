'use client';

import React from 'react';
import { X } from 'lucide-react';
import FullScreenLoader from '@/components/common/full-screen-loader';

interface AddSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  newSlotDate: string;
  setNewSlotDate: (date: string) => void;
  newSlotTime: string;
  setNewSlotTime: (time: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  preparationTime: string;
  setPreparationTime: (time: string) => void;
  isLoading?: boolean;
  isEditMode?: boolean;
  existingSlotId?: string;
}

const AddSlotModal: React.FC<AddSlotModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  newSlotDate,
  setNewSlotDate,
  newSlotTime,
  setNewSlotTime,
  duration,
  setDuration,
  preparationTime,
  setPreparationTime,
  isLoading = false,
  isEditMode = false,
  existingSlotId,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <FullScreenLoader loading={isLoading} />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="p-4 md:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg backdrop-blur-sm bg-[rgba(33,33,33,1)] rounded-lg">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              {isEditMode ? 'Edit Time Slot' : 'Add New Time Slot'}
            </h3>
            {isEditMode && onDelete && (
              <button
                onClick={onDelete}
                disabled={isLoading}
                className="px-4 py-2 text-red-400 hover:text-red-300 border border-red-400 hover:border-red-300 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-400/10"
                title="Delete time slot"
              >
                Delete
              </button>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date
              </label>
              <input
                type="date"
                value={newSlotDate}
                onChange={(e) => setNewSlotDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded text-white text-sm focus:outline-none border border-grey bg-transparent touch-manipulation [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Time
              </label>
              <input
                type="time"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded text-white text-sm focus:outline-none [color-scheme:dark] border border-grey bg-transparent touch-manipulation [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded text-white text-sm focus:outline-none border border-grey bg-transparent touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Preparation Time (Minutes)
              </label>
              <input
                type="number"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded text-white text-sm focus:outline-none border border-grey bg-transparent touch-manipulation"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6 sm:mt-8">
            <button
              onClick={onSubmit}
              disabled={
                isLoading ||
                !newSlotDate ||
                !newSlotTime ||
                !duration ||
                !preparationTime
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-black rounded font-semibold hover:opacity-90 transition-opacity bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Slot' : '+ Add Slot')}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded font-semibold hover:opacity-90 transition-opacity bg-transparent border border-golden-glow text-golden-glow text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSlotModal;
