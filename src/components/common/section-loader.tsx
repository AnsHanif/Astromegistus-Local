'use client';

import React from 'react';
import SpinnerLoader from './spinner-loader/spinner-loader';

type SectionLoaderProps = {
  message?: string;
  className?: string;
  size?: number;
  color?: string;
};

const SectionLoader = ({
  message = 'Loading...',
  className = '',
  size = 40,
  color = '#D4AF37', // Golden color to match your theme
}: SectionLoaderProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <SpinnerLoader size={size} color={color} />
      <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
};

export default SectionLoader;
