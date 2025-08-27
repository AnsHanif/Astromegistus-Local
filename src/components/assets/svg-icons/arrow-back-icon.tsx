import { SvgIconProps } from '@/types';
import React, { FC } from 'react';

const ArrowBackIcon: FC<SvgIconProps> = ({
  width,
  height,
  className = '',
  color = '#AB6A1C',
}) => {
  return (
    <svg
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.5 12H4.5M4.5 12L10.125 18M4.5 12L10.125 6"
        stroke={'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowBackIcon;
