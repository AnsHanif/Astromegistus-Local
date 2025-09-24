import { SvgIconProps } from '@/types';
import React, { FC } from 'react';

const AddIcon: FC<SvgIconProps> = ({
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
      <path
        d="M12 5V19M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AddIcon;