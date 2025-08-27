import React, { FC } from 'react';
import { SvgIconProps } from '@/types';

const ArrowPrev: FC<SvgIconProps> = ({ width, height, className = '' }) => {
  return (
    <svg
      className={`w-6 h-6 text-black ${className}`}
      fill="none"
      width={width || 24}
      height={height || 24}
      stroke="currentColor"
      strokeWidth="1"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
};

export default ArrowPrev;
