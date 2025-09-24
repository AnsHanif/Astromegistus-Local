import { SvgIconProps } from '@/types';
import React, { FC } from 'react';

const DateIcon: FC<SvgIconProps> = ({
  width,
  height,
  className = '',
  color = 'black',
}) => {
  return (
    <svg
      width={width || 20}
      height={height || 20}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 3.33268V1.66602M12.5 3.33268V4.99935M12.5 3.33268H8.75M2.5 8.33268V15.8327C2.5 16.2747 2.67559 16.6986 2.98816 17.0112C3.30072 17.3238 3.72464 17.4993 4.16667 17.4993H15.8333C16.2754 17.4993 16.6993 17.3238 17.0118 17.0112C17.3244 16.6986 17.5 16.2747 17.5 15.8327V8.33268M2.5 8.33268H17.5M2.5 8.33268V4.99935C2.5 4.55732 2.67559 4.1334 2.98816 3.82084C3.30072 3.50828 3.72464 3.33268 4.16667 3.33268H5.83333M17.5 8.33268V4.99935C17.5 4.55732 17.3244 4.1334 17.0118 3.82084C16.6993 3.50828 16.2754 3.33268 15.8333 3.33268H15.4167M5.83333 1.66602V4.99935"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DateIcon;