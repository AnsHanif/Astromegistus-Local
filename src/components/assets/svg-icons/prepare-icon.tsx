import { SvgIconProps } from '@/types';
import React, { FC } from 'react';

const PrepareIcon: FC<SvgIconProps> = ({
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
      <path d="M12 7C9.1747 6.99989 6.99997 9.25 7 12C7.00003 14.55 9.02119 17 12 17C14.7712 17 17 14.75 17 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

export default PrepareIcon;