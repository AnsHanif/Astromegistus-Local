// components/common/custom-calendar/CustomCalendar.tsx
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CustomCalendarProps {
  value: Value;
  onChange: (value: Value) => void;
  className?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <Calendar
      value={value}
      onChange={onChange}
      next2Label={null} // hides "next year" button
      prev2Label={null}
      className={`text-sm md:text-size-secondary ${className || ''}`}
    />
  );
};

export default CustomCalendar;
