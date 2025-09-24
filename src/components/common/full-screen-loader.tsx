'use client';

import React from 'react';

type FullScreenLoaderProps = { size?: number; loading?: boolean };

const FullScreenLoader = ({
  size = 90,
  loading = true,
}: FullScreenLoaderProps) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div
        aria-label="Loading Spinner"
        data-testid="spinner-loader"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(
            transparent 0deg,
            transparent 45deg,
            var(--color-golden-glow) 45deg,
            var(--color-pink-shade) 180deg,
            var(--color-golden-glow-dark) 315deg,
            transparent 315deg
          )`,
          WebkitMask:
            'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 0)',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 0)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style jsx global>{`
        :root {
          --color-golden-glow: #dab612;
          --color-pink-shade: #eed66c;
          --color-golden-glow-dark: #ab6a1c;
        }
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

export default FullScreenLoader;
