import { SvgIconProps } from '@/types';
import React, { FC } from 'react';

const GradientLockIcon: FC<SvgIconProps> = ({
  width = 50,
  height = 50,
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M39.0625 18.75H37.5V12.7867C37.5 5.61641 32.3117 0 24.9422 0C17.543 0 12.5 5.73594 12.5 12.7867V18.75H10.9375C7.49062 18.75 4.6875 21.5531 4.6875 25V43.75C4.6875 47.1969 7.49062 50 10.9375 50H39.0625C42.5094 50 45.3125 47.1969 45.3125 43.75V25C45.3125 21.5531 42.5094 18.75 39.0625 18.75ZM15.625 12.7867C15.625 7.46016 19.2656 3.125 24.9422 3.125C30.5602 3.125 34.375 7.36875 34.375 12.7867V18.75H15.625V12.7867ZM42.1875 43.75C42.1875 45.4727 40.7852 46.875 39.0625 46.875H10.9375C9.21489 46.875 7.81255 45.4727 7.81255 43.75V25C7.81255 23.2773 9.21489 21.875 10.9375 21.875H39.0625C40.7852 21.875 42.1875 23.2773 42.1875 25V43.75ZM25 28.125C23.2743 28.125 21.875 29.5242 21.875 31.25C21.875 32.4039 22.5079 33.4 23.4375 33.9414V39.0625C23.4375 39.925 24.1375 40.625 25 40.625C25.8625 40.625 26.5625 39.925 26.5625 39.0625V33.9414C27.4922 33.4 28.125 32.4031 28.125 31.25C28.125 29.5242 26.7258 28.125 25 28.125Z"
        fill="url(#paint0_linear_340_2269)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_340_2269"
          x1="4.6875"
          y1="25"
          x2="45.3125"
          y2="25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DAB612" />
          <stop offset="0.5" stopColor="#EED66C" />
          <stop offset="1" stopColor="#AB6A1C" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GradientLockIcon;
