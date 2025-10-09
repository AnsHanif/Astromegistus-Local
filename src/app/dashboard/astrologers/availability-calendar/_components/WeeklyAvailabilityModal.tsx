'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import {
  WeeklyAvailability,
  WeeklyAvailabilityInput,
} from '@/services/api/provider-availability-api';
import { useQuery } from '@tanstack/react-query';
import { TIMEZONES } from '@/constants/timezones';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import { useUpdateTimezone } from '@/hooks/mutation/profile-mutation/profile';

interface WeeklyAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    availabilities: WeeklyAvailabilityInput[],
    daysToDelete?: number[]
  ) => void;
  existingAvailability?: WeeklyAvailability[];
  isLoading: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

interface TimeWindow {
  startTime: string;
  endTime: string;
}

const WeeklyAvailabilityModal: React.FC<WeeklyAvailabilityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingAvailability = [],
  isLoading,
}) => {
  // Get current user data for timezone
  const { data: authData } = useQuery<any>({
    queryKey: ['authUser'],
    enabled: false, // This data should come from props or Redux, not a separate query
  });
  const currentUserTimezone = authData?.user?.timeZone || 'America/New_York';

  // Group existing availability by day
  const [availabilityByDay, setAvailabilityByDay] = useState<
    Record<number, TimeWindow[]>
  >({});

  // Track which days originally had availability (for deletion detection)
  const [originalDays, setOriginalDays] = useState<Set<number>>(new Set());

  // Timezone state
  const [selectedTimezone, setSelectedTimezone] =
    useState<string>(currentUserTimezone);

  // Timezone update mutation
  const updateTimezoneMutation = useUpdateTimezone();

  // Update selected timezone when user data loads
  useEffect(() => {
    if (currentUserTimezone && currentUserTimezone !== 'UTC') {
      setSelectedTimezone(currentUserTimezone);
    }
  }, [currentUserTimezone]);

  useEffect(() => {
    if (existingAvailability.length > 0) {
      const grouped: Record<number, TimeWindow[]> = {};
      const daysSet = new Set<number>();

      existingAvailability.forEach((avail) => {
        daysSet.add(avail.dayOfWeek);
        if (!grouped[avail.dayOfWeek]) {
          grouped[avail.dayOfWeek] = [];
        }
        grouped[avail.dayOfWeek].push({
          startTime: avail.startTime,
          endTime: avail.endTime,
        });
      });

      setAvailabilityByDay(grouped);
      setOriginalDays(daysSet);
    } else {
      setAvailabilityByDay({});
      setOriginalDays(new Set());
    }
  }, [existingAvailability]);

  const addTimeWindow = (dayOfWeek: number) => {
    setAvailabilityByDay((prev) => ({
      ...prev,
      [dayOfWeek]: [
        ...(prev[dayOfWeek] || []),
        { startTime: '09:00', endTime: '17:00' },
      ],
    }));
  };

  const removeTimeWindow = (dayOfWeek: number, index: number) => {
    setAvailabilityByDay((prev: any) => {
      const windows = [...(prev[dayOfWeek] || [])];
      windows.splice(index, 1);
      return {
        ...prev,
        [dayOfWeek]: windows.length > 0 ? windows : undefined,
      };
    });
  };

  const updateTimeWindow = (
    dayOfWeek: number,
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setAvailabilityByDay((prev) => {
      const windows = [...(prev[dayOfWeek] || [])];
      windows[index] = {
        ...windows[index],
        [field]: value,
      };
      return {
        ...prev,
        [dayOfWeek]: windows,
      };
    });
  };

  const handleTimezoneChange = (newTimezone: string) => {
    setSelectedTimezone(newTimezone);
    // Update user's timezone in the backend
    updateTimezoneMutation.mutate(newTimezone);
  };

  const handleSubmit = () => {
    // Convert to flat array
    const availabilities: WeeklyAvailabilityInput[] = [];

    // Get all days with current windows
    const currentDays = new Set<number>();

    Object.entries(availabilityByDay).forEach(([dayStr, windows]) => {
      const dayOfWeek = parseInt(dayStr);
      if (windows && windows.length > 0) {
        currentDays.add(dayOfWeek);
        windows.forEach((window) => {
          availabilities.push({
            dayOfWeek,
            startTime: window.startTime,
            endTime: window.endTime,
          });
        });
      }
    });

    // Find days that had availability but now have none (deleted all windows)
    const daysToDelete: number[] = [];
    originalDays.forEach((day) => {
      if (!currentDays.has(day)) {
        daysToDelete.push(day);
        console.log(`Day ${day} had availability but all windows were deleted`);
      }
    });

    console.log('Submitting availabilities:', availabilities);
    console.log('Days to delete:', daysToDelete);
    console.log('Original days:', Array.from(originalDays));
    console.log('Current days:', Array.from(currentDays));

    // Pass both availabilities and daysToDelete to parent
    onSubmit(availabilities, daysToDelete);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-graphite rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-graphite border-b border-gray-700 p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Set Weekly Availability
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          <p className="text-gray-300 text-sm">
            Set your regular weekly availability. You can add multiple time
            windows for each day (e.g., 10 AM - 4 PM and 7 PM - 11 PM).
          </p>

          {/* Timezone Selector */}
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-white font-semibold">
                Your Timezone
              </label>
              <span className="text-sm text-gray-400">
                All times are in your local timezone
              </span>
            </div>
            <CustomSelect
              onSelect={handleTimezoneChange}
              options={TIMEZONES.map((tz) => ({
                label: tz.label,
                value: tz.value,
              }))}
              size="sm"
              variant="default"
              placeholder="Select timezone"
              selectedValue={selectedTimezone}
              className="w-full"
              triggerClassName="h-12 w-full text-sm cursor-pointer bg-gray-700 text-white border-gray-600 focus:border-golden-glow hover:border-gray-500"
              contentClassName="w-full max-h-60 overflow-y-auto bg-gray-800 border-gray-700 z-[100]"
              itemClassName="text-white hover:bg-gray-700 cursor-pointer"
              chevronClassName="text-gray-400"
            />
          </div>

          {DAYS_OF_WEEK.map((day) => {
            const windows = availabilityByDay[day.value] || [];
            const hasWindows = windows.length > 0;

            return (
              <div
                key={day.value}
                className="border border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-semibold">{day.label}</h3>
                  <button
                    onClick={() => addTimeWindow(day.value)}
                    className="flex items-center gap-2 text-sm bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black px-3 py-1.5 rounded font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Add Time
                  </button>
                </div>

                {!hasWindows && (
                  <p className="text-gray-500 text-sm italic">
                    Not available on this day
                  </p>
                )}

                <div className="space-y-3">
                  {windows.map((window, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 flex-wrap"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <input
                          type="time"
                          value={window.startTime}
                          onChange={(e) =>
                            updateTimeWindow(
                              day.value,
                              index,
                              'startTime',
                              e.target.value
                            )
                          }
                          className="bg-gray-800 text-white rounded px-3 py-2 border border-gray-600 focus:border-golden-glow focus:outline-none"
                        />
                        <span className="text-gray-400">to</span>
                        <input
                          type="time"
                          value={window.endTime}
                          onChange={(e) =>
                            updateTimeWindow(
                              day.value,
                              index,
                              'endTime',
                              e.target.value
                            )
                          }
                          className="bg-gray-800 text-white rounded px-3 py-2 border border-gray-600 focus:border-golden-glow focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => removeTimeWindow(day.value, index)}
                        className="text-red-500 hover:text-red-400 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-graphite border-t border-gray-700 p-4 sm:p-6 flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded font-semibold hover:opacity-90 transition-opacity bg-transparent border border-gray-400 text-gray-400 hover:border-gray-300 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black rounded font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Availability'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyAvailabilityModal;
