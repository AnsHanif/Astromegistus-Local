import { SvgIconProps } from '@/types';
import React, { FC } from 'react';

const CalendarIcon: FC<SvgIconProps> = ({
  width,
  height,
  className = '',
  color = 'currentColor',
}) => {
  return (
    <svg
      width={width || 16}
      height={height || 16}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15 4V2M15 4V6M15 4H10.5M3 10V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V10M3 10H21M3 10V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H7M21 10V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H18.5M7 2V6" stroke="url(#paint0_linear_2043_2833)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="paint0_linear_2043_2833" x1="3" y1="11.5" x2="21" y2="11.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DAB612"/>
          <stop offset="0.5" stopColor="#EED66C"/>
          <stop offset="1" stopColor="#AB6A1C"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CalendarIcon;