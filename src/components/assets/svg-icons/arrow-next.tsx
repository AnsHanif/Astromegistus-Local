import { SvgIconProps } from '@/types';
import React, { FC } from 'react';

const ArrowNext: FC<SvgIconProps> = ({ width, height, className = '' }) => {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
};

export default ArrowNext;
