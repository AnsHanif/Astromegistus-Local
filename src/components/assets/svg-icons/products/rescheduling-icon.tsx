import { SvgIconProps } from '@/types';
import React, { FC } from 'react';

const ReschedulingIcon: FC<SvgIconProps> = ({ width, height, className }) => {
  return (
    <svg
      width={width || 96}
      height={height || 107}
      viewBox="0 0 96 107"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M85.3333 10.9997H80V0.333008H69.3333V10.9997H26.6667V0.333008H16V10.9997H10.6667C4.74667 10.9997 0 15.7463 0 21.6663V96.333C0 99.162 1.12381 101.875 3.12419 103.875C5.12458 105.876 7.83769 107 10.6667 107H85.3333C91.2 107 96 102.2 96 96.333V21.6663C96 18.8374 94.8762 16.1243 92.8758 14.1239C90.8754 12.1235 88.1623 10.9997 85.3333 10.9997ZM85.3333 96.333H10.6667V37.6663H85.3333V96.333ZM48 48.333V58.9997H69.3333V74.9997H48V85.6663L26.6667 66.9997L48 48.333Z"
        fill="#093B1D"
      />
    </svg>
  );
};

export default ReschedulingIcon;
