'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import AstrologersDashboardLayout from '../../_components/astrologers-dashboard.layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import AddSlotModal from './AddSlotModal';
import ConfirmationModal from './ConfirmationModal';
import { useGetUserMonthSlots } from '@/hooks/query/timeslot-queries';
import { useCreateTimeSlot, useDeleteTimeSlot } from '@/hooks/mutation/timeslot-mutations';
import { TimeSlot } from '@/services/api/timeslot-api';
import FullScreenLoader from '@/components/common/full-screen-loader';

interface TimeSlotDisplay {
  date: string;
  time: string;
  isBooked?: boolean;
  clientName?: string;
  clientAvatar?: string;
}

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
    duration?: number;
    preparationTime?: number;
  };
}

const AvailabilityCalendarPage = () => {
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [preparationTime, setPreparationTime] = useState('15');
  const [pendingEvent, setPendingEvent] = useState<CalendarEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  // API hooks
  const createTimeSlotMutation = useCreateTimeSlot();
  const deleteTimeSlotMutation = useDeleteTimeSlot();
  const { data: monthSlotsData, isLoading } = useGetUserMonthSlots(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  // Get calendar API reference
  const calendarRef = React.useRef<any>(null);

  // Ensure calendar starts with current date
  useEffect(() => {
    const timer = setTimeout(() => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.gotoDate(new Date());
        setCurrentDate(new Date());
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Convert API data to calendar events
  useEffect(() => {
    if (monthSlotsData?.data?.data) {
      const slots = monthSlotsData.data.data;
      const calendarEvents: CalendarEvent[] = slots.map((slot: TimeSlot) => ({
        id: slot.id,
        title: slot.time,
        date: new Date(slot.date).toISOString().split('T')[0],
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: '#000',
        classNames: [slot.isAvailable ? 'available-slot' : 'booked-slot'],
        extendedProps: {
          duration: slot.duration,
          preparationTime: slot.preparationTime,
        },
      }));
      setEvents(calendarEvents);
    }
  }, [monthSlotsData]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (direction === 'prev') {
        calendarApi.prev();
      } else {
        calendarApi.next();
      }
      const newDate = calendarApi.getDate();
      setCurrentDate(newDate);
      // Clear events while new month loads
      setEvents([]);
    }
  };

  // Generate calendar days based on current date using FullCalendar logic
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
      // 6 weeks * 7 days
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

  // Time slots data for visual display
  const timeSlots: { [key: number]: TimeSlotDisplay } = {};
  events.forEach((event) => {
    const eventDate = new Date(event.date);
    if (
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    ) {
      const day = eventDate.getDate();
      timeSlots[day] = {
        date: event.date,
        time: event.title.split(' - ')[0],
        isBooked: event.classNames.includes('booked-slot'),
        clientName: event.extendedProps?.clientName,
        clientAvatar: event.extendedProps?.clientAvatar,
      };
    }
  });

  // Calendar days exactly matching your image layout
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handleDateClick = (day: number) => {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    
    // Check if there's already a slot for this day
    const existingSlot = monthSlotsData?.data?.data?.find((slot: TimeSlot) => {
      const slotDate = new Date(slot.date).toISOString().split('T')[0];
      return slotDate === dateStr;
    });
    
    if (existingSlot) {
      // Open in edit mode
      setEditingSlot(existingSlot);
      setNewSlotDate(dateStr);
      // Convert the API time format back to 24-hour format for the time input
      const timeRegex = /(\d{1,2}):(\d{2}) (AM|PM)/i;
      const match = existingSlot.time.match(timeRegex);
      if (match) {
        let hour = parseInt(match[1]);
        const minute = match[2];
        const ampm = match[3].toUpperCase();
        
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute}`;
        setNewSlotTime(timeStr);
      }
      setDuration(existingSlot.duration.toString());
      setPreparationTime(existingSlot.preparationTime.toString());
    } else {
      // Open in create mode
      setEditingSlot(null);
      setNewSlotDate(dateStr);
      setNewSlotTime('');
      setDuration('60');
      setPreparationTime('15');
    }
    
    setShowAddSlotModal(true);
  };

  const handleAddSlot = () => {
    if (newSlotDate && newSlotTime && duration && preparationTime) {
      // Convert 24-hour time to 12-hour format for display
      const timeObj = new Date(`2000-01-01T${newSlotTime}:00`);
      const displayTime = timeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const newEvent = {
        id: Date.now().toString(),
        title: displayTime,
        date: newSlotDate,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: '#000',
        classNames: ['available-slot'],
      };

      setPendingEvent(newEvent);
      setShowAddSlotModal(false);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmReschedule = async () => {
    if (pendingEvent && newSlotDate && newSlotTime) {
      try {
        // Convert time to 12-hour format for API
        const timeObj = new Date(`2000-01-01T${newSlotTime}:00`);
        const apiTime = timeObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        await createTimeSlotMutation.mutateAsync({
          date: newSlotDate,
          time: apiTime,
          duration: parseInt(duration),
          preparationTime: parseInt(preparationTime),
        });

        // Add to local state for immediate UI update
        setEvents([...events, pendingEvent]);
        setPendingEvent(null);
        setShowConfirmModal(false);
        setNewSlotDate('');
        setNewSlotTime('');
        setDuration('60');
        setPreparationTime('15');
      } catch (error) {
        // Error handling is done in the mutation hook
      }
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setPendingEvent(null);
    setShowAddSlotModal(true);
  };

  const handleDeleteSlotConfirmation = () => {
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (editingSlot) {
      try {
        await deleteTimeSlotMutation.mutateAsync(editingSlot.id);
        setShowDeleteConfirmModal(false);
        setShowAddSlotModal(false);
        setEditingSlot(null);
        setNewSlotDate('');
        setNewSlotTime('');
        setDuration('60');
        setPreparationTime('15');
      } catch (error) {
        // Error handling is done in the mutation hook
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
  };

  const handleCloseModal = () => {
    setShowAddSlotModal(false);
    setEditingSlot(null);
    setNewSlotDate('');
    setNewSlotTime('');
    setDuration('60');
    setPreparationTime('15');
  };

  return (
    <AstrologersDashboardLayout>
      <div className="text-white mt-4 p-4 overflow-x-hidden">
        {/* Add Slot Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddSlotModal(true)}
            className="bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black px-4 py-2 rounded flex items-center gap-2 font-semibold"
          >
            Add Slot
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
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h2>

          <button
            className="text-white hover:text-golden-glow p-2"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

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

          {/* Loading State */}
          <FullScreenLoader loading={isLoading} />

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 lg:gap-6">
            {calendarDays.flat().map((day, index) => (
              <div
                key={index}
                className={`border-none flex flex-col items-start justify-start p-1 sm:p-2 relative cursor-pointer hover:opacity-80 transition-opacity rounded-sm aspect-square min-h-[60px] sm:min-h-[80px] md:min-h-[100px] ${day ? 'bg-graphite' : 'bg-transparent'}`}
                onClick={() => day && handleDateClick(day)}
              >
                {day && (
                  <>
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {day}
                    </span>
                    {timeSlots[day] && (
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="text-xs px-1 py-0.5 rounded text-black bg-gradient-to-r from-golden-glow via-pink-shade to-bronze">
                          <div className="truncate text-xs">
                            {timeSlots[day].time}
                          </div>
                          {timeSlots[day].isBooked &&
                            timeSlots[day].clientName && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="truncate text-xs font-medium">
                                  {timeSlots[day].clientName!.split(' ')[0]}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hidden FullCalendar for functionality */}
        <div className="hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            initialDate={new Date()}
            headerToolbar={false}
            events={events}
            dateClick={(info) => {
              setNewSlotDate(info.dateStr);
              setShowAddSlotModal(true);
            }}
            datesSet={(dateInfo) => {
              setCurrentDate(new Date(dateInfo.start));
            }}
          />
        </div>

        <AddSlotModal
          isOpen={showAddSlotModal}
          onClose={handleCloseModal}
          onSubmit={handleAddSlot}
          onDelete={handleDeleteSlotConfirmation}
          newSlotDate={newSlotDate}
          setNewSlotDate={setNewSlotDate}
          newSlotTime={newSlotTime}
          setNewSlotTime={setNewSlotTime}
          duration={duration}
          setDuration={setDuration}
          preparationTime={preparationTime}
          setPreparationTime={setPreparationTime}
          isLoading={createTimeSlotMutation.isPending || deleteTimeSlotMutation.isPending}
          isEditMode={!!editingSlot}
          existingSlotId={editingSlot?.id}
        />

        <ConfirmationModal
          isOpen={showConfirmModal}
          onConfirm={handleConfirmReschedule}
          onCancel={handleCancelConfirm}
          pendingEvent={pendingEvent}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md text-center backdrop-blur-sm bg-[rgba(33,33,33,1)] rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Delete Time Slot</h3>
              
              <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8 px-2">
                Are you sure you want to delete this time slot? This action cannot be undone.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteTimeSlotMutation.isPending}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-white rounded font-semibold hover:opacity-90 transition-opacity bg-red-600 hover:bg-red-700 text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteTimeSlotMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={handleCancelDelete}
                  disabled={deleteTimeSlotMutation.isPending}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded font-semibold hover:opacity-90 transition-opacity bg-transparent border border-gray-400 text-gray-400 hover:border-gray-300 hover:text-gray-300 text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AstrologersDashboardLayout>
  );
};

export default AvailabilityCalendarPage;
