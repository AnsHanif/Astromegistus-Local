'use client';

import React from 'react';

type SpinnerLoaderProps = {
  size?: number;
  color?: string;
  loading?: boolean;
  className?: string;
};

const SpinnerLoader = ({
  size = 30,
  color = '#000',
  loading = true,
  className = '',
}: SpinnerLoaderProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {loading && (
        <div
          className="spinner"
          aria-label="Loading Spinner"
          data-testid="spinner-loader"
          style={{
            width: size,
            height: size,
            background: `conic-gradient(transparent 0deg, transparent 45deg, ${color} 45deg, ${color} 315deg, transparent 315deg)`,
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SpinnerLoader;
