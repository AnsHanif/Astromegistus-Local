'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Settings } from 'lucide-react';
import AstrologersDashboardLayout from '../../_components/astrologers-dashboard.layout';
import WeeklyAvailabilityModal from './WeeklyAvailabilityModal';
import BookedSlotsModal from './BookedSlotsModal';
import FullScreenLoader from '@/components/common/full-screen-loader';
import { useGetWeeklyAvailability } from '@/hooks/query/provider-availability-queries';
import { useSetWeeklyAvailability } from '@/hooks/mutation/provider-availability-mutations';
import { useGetUserMonthSlots } from '@/hooks/query/timeslot-queries';
import { TimeSlot } from '@/services/api/timeslot-api';

const AvailabilityCalendarPage = () => {
  const [showWeeklyAvailabilityModal, setShowWeeklyAvailabilityModal] = useState(false);
  const [showBookedSlotsModal, setShowBookedSlotsModal] = useState(false);
  const [selectedDaySlots, setSelectedDaySlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());

  // API hooks
  const { data: weeklyAvailabilityData, isLoading: loadingWeeklyAvailability } =
    useGetWeeklyAvailability();
  const setWeeklyAvailabilityMutation = useSetWeeklyAvailability();

  // Get month slots for display (booked) - Backend handles timezone conversion
  const { data: monthSlotsData, isLoading: loadingMonthSlots } = useGetUserMonthSlots(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  const weeklyAvailability = Array.isArray(weeklyAvailabilityData?.data?.data?.availabilities)
    ? weeklyAvailabilityData.data.data.availabilities
    : [];
  // const monthSlots = Array.isArray(monthSlotsData?.data?.data)
  //   ? monthSlotsData.data.data
  //   : [];
  const monthSlots: any[] = [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentWeek = [];

    for (let i = 0; i < 42; i++) {
      const currentDateInLoop = new Date(startDate);
      currentDateInLoop.setDate(startDate.getDate() + i);

      if (currentDateInLoop.getMonth() === month) {
        currentWeek.push(currentDateInLoop.getDate());
      } else {
        currentWeek.push(null);
      }

      if (currentWeek.length === 7) {
        days.push([...currentWeek]);
        currentWeek.length = 0;
      }
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Group slots by day - Backend already converted to user's current timezone
  const slotsByDay: { [key: number]: TimeSlot[] } = {};
  monthSlots.forEach((slot: TimeSlot) => {
    // Backend provides dayOfMonth already converted to user's current timezone
    const day = slot.dayOfMonth;
    if (!day) return;

    if (!slotsByDay[day]) {
      slotsByDay[day] = [];
    }
    slotsByDay[day].push(slot);
  });

  // Check if a day has weekly availability
  const hasWeeklyAvailability = (day: number) => {
    if (!Array.isArray(weeklyAvailability) || weeklyAvailability.length === 0) {
      return false;
    }
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    return weeklyAvailability.some((avail) => avail.dayOfWeek === dayOfWeek);
  };

  const handleSetWeeklyAvailability = async (availabilities: any[], daysToDelete?: number[]) => {
    console.log('[CALENDAR] Saving weekly availability:', { availabilities, daysToDelete });
    await setWeeklyAvailabilityMutation.mutateAsync({ availabilities, daysToDelete });
    setShowWeeklyAvailabilityModal(false);
  };

  const handleDayClick = (day: number, slots: TimeSlot[]) => {
    if (slots.length === 0) return;

    // Format date as YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;

    setSelectedDate(dateStr);
    setSelectedDaySlots(slots);
    setShowBookedSlotsModal(true);
  };

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const isLoading = loadingWeeklyAvailability || loadingMonthSlots;

  return (
    <AstrologersDashboardLayout>
      <div className="text-white mt-4 p-4 overflow-x-hidden">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end mb-6">
          <button
            onClick={() => setShowWeeklyAvailabilityModal(true)}
            className="bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black px-4 py-2 rounded flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition-opacity"
          >
            <Settings className="w-5 h-5" />
            Weekly Availability
          </button>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <button
            className="text-white hover:text-golden-glow p-2"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <h2 className="text-lg md:text-xl font-semibold text-white text-center">
            {currentDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </h2>

          <button
            className="text-white hover:text-golden-glow p-2"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Info Section */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            About Your Availability
          </h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>
              • <span className="text-golden-glow font-semibold">Green background</span>: Days with
              weekly availability set
            </p>
            <p>
              • <span className="text-pink-shade font-semibold">Booked slots</span>: Confirmed
              client bookings
            </p>
            <p className="mt-2 text-gray-400 italic">
              Click "Weekly Availability" to set your regular working hours with multiple time windows per day.
            </p>
          </div>
        </div>

        {/* Loading State */}
        <FullScreenLoader loading={isLoading} />

        {/* Custom Calendar */}
        <div className="calendar-container w-full max-w-6xl mx-auto">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 lg:gap-6 mb-4">
            {weekdays.map((day) => (
              <div
                key={day}
                className="text-center text-gray-400 font-semibold text-xs sm:text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 lg:gap-6">
            {calendarDays.flat().map((day, index) => {
              if (!day) {
                return <div key={index} className="aspect-square min-h-[60px]" />;
              }

              const daySlots = slotsByDay[day] || [];
              // All slots from the API are BOOKED slots (V2)
              const bookedSlots = daySlots;
              const hasAvailability = hasWeeklyAvailability(day);

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(day, bookedSlots)}
                  className={`border border-gray-700 flex flex-col items-start justify-start p-1 sm:p-2 relative rounded-sm aspect-square min-h-[60px] sm:min-h-[80px] md:min-h-[100px] ${
                    hasAvailability ? 'bg-green-900/20' : 'bg-graphite'
                  } ${
                    bookedSlots.length > 0 ? 'cursor-pointer hover:border-golden-glow transition-colors' : ''
                  }`}
                >
                  <span className="text-white font-semibold text-sm sm:text-base">{day}</span>

                  {/* Availability indicator */}
                  {hasAvailability && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  )}

                  {/* Booked slots display */}
                  {bookedSlots.length > 0 && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="text-xs px-1 py-0.5 rounded bg-pink-shade text-black font-semibold text-center hover:opacity-90 transition-opacity">
                        {bookedSlots.length} Booked
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Availability Modal */}
        <WeeklyAvailabilityModal
          isOpen={showWeeklyAvailabilityModal}
          onClose={() => setShowWeeklyAvailabilityModal(false)}
          onSubmit={handleSetWeeklyAvailability}
          existingAvailability={weeklyAvailability}
          isLoading={setWeeklyAvailabilityMutation.isPending}
        />

        {/* Booked Slots Modal */}
        <BookedSlotsModal
          isOpen={showBookedSlotsModal}
          onClose={() => setShowBookedSlotsModal(false)}
          slots={selectedDaySlots}
          selectedDate={selectedDate}
        />
      </div>
    </AstrologersDashboardLayout>
  );
};

export default AvailabilityCalendarPage;
