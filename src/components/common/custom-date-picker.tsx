'use client';

import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CustomDatePickerProps {
  value: string; // yyyy-MM-dd format
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
  label,
}) => {
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
              {value ? format(parse(value, 'yyyy-MM-dd', new Date()), 'PPP') : placeholder}
            </span>
            <CalendarIcon
              size={16}
              className="text-gray-400 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 bg-[rgba(33,33,33,1)] border border-grey" align="start">
          <Calendar
            mode="single"
            selected={value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined}
            onSelect={(date) => {
              if (date) {
                onChange(format(date, 'yyyy-MM-dd'));
              }
            }}
            disabled={disabled}
            className="text-white [&_.rdp-day]:text-white [&_.rdp-head_cell]:text-white [&_.rdp-caption]:text-white [&_.rdp-nav_button]:text-white [&_.rdp-day_selected]:bg-gradient-to-r [&_.rdp-day_selected]:from-golden-glow [&_.rdp-day_selected]:via-pink-shade [&_.rdp-day_selected]:to-bronze [&_.rdp-day_selected]:text-black [&_.rdp-day:hover]:bg-white/10"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomDatePicker;