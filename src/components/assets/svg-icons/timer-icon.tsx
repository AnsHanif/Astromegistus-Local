import { SvgIconProps } from '@/types';
import React, { FC } from 'react';

const TimerIcon: FC<SvgIconProps> = ({
  width,
  height,
  className = '',
  color = 'currentColor',
}) => {
  return (
    <svg
      width={width || 32}
      height={height || 32}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M42.5 30C35.6 30 30 35.6 30 42.5C30 49.4 35.6 55 42.5 55C49.4 55 55 49.4 55 42.5C55 35.6 49.4 30 42.5 30ZM46.625 48.375L41.25 43V35H43.75V41.975L48.375 46.6L46.625 48.375ZM45 7.5H37.05C36 4.6 33.25 2.5 30 2.5C26.75 2.5 24 4.6 22.95 7.5H15C12.25 7.5 10 9.75 10 12.5V50C10 52.75 12.25 55 15 55H30.275C28.7941 53.566 27.5906 51.8709 26.725 50H15V12.5H20V20H40V12.5H45V25.2C46.775 25.45 48.45 25.975 50 26.7V12.5C50 9.75 47.75 7.5 45 7.5ZM30 12.5C28.625 12.5 27.5 11.375 27.5 10C27.5 8.625 28.625 7.5 30 7.5C31.375 7.5 32.5 8.625 32.5 10C32.5 11.375 31.375 12.5 30 12.5Z" fill={color}/>
    </svg>
  );
};

export default TimerIcon;