'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CustomTimePickerProps {
  value: string; // HH:mm format (24-hour)
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pick a time',
  disabled = false,
  className,
  label,
}) => {
  // Time picker state
  const [selectedHour, setSelectedHour] = useState<string>('12');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

  // Parse existing time when component mounts or value changes
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';

      setSelectedHour(hour12.toString());
      setSelectedMinute(minutes);
      setSelectedPeriod(period);
    }
  }, [value]);

  // Convert 12-hour format to 24-hour format for API
  const convertTo24Hour = (hour: string, minute: string, period: 'AM' | 'PM') => {
    let hour24 = parseInt(hour);
    if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    } else if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    }
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };

  // Update the main time value when custom time changes
  const handleTimeChange = (hour: string, minute: string, period: 'AM' | 'PM') => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedPeriod(period);
    onChange(convertTo24Hour(hour, minute, period));
  };

  // Generate options
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full px-3 sm:px-4 py-2 sm:py-3 rounded text-white text-sm focus:outline-none border border-grey bg-transparent touch-manipulation justify-between font-normal hover:bg-transparent hover:border-grey",
              !value && "text-gray-400",
              className
            )}
          >
            <span className="truncate">
              {value ? format(parse(value, 'HH:mm', new Date()), 'h:mm a') : placeholder}
            </span>
            <Clock
              size={16}
              className="text-gray-400 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 bg-[rgba(33,33,33,1)] border border-grey" align="start">
          <div className="flex gap-1">
            {/* Hours */}
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-2 text-center">Hour</label>
              <div className="max-h-40 overflow-y-auto border border-grey rounded w-12">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleTimeChange(hour, selectedMinute, selectedPeriod)}
                    disabled={disabled}
                    className={cn(
                      "px-1 py-1.5 text-xs w-full text-center hover:bg-white/10 transition-colors",
                      selectedHour === hour
                        ? "bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black"
                        : "text-white"
                    )}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-2 text-center">Min</label>
              <div className="max-h-40 overflow-y-auto border border-grey rounded w-12">
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    onClick={() => handleTimeChange(selectedHour, minute, selectedPeriod)}
                    disabled={disabled}
                    className={cn(
                      "px-1 py-1.5 text-xs w-full text-center hover:bg-white/10 transition-colors",
                      selectedMinute === minute
                        ? "bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black"
                        : "text-white"
                    )}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM */}
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-2 text-center">Period</label>
              <div className="border border-grey rounded w-14">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => handleTimeChange(selectedHour, selectedMinute, period)}
                    disabled={disabled}
                    className={cn(
                      "px-1 py-1.5 text-xs w-full text-center hover:bg-white/10 transition-colors",
                      selectedPeriod === period
                        ? "bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black"
                        : "text-white"
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomTimePicker;