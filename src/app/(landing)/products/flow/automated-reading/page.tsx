import React, { Suspense } from 'react';
import AutomatedReadingPage from './_components/automated-reading-page';

const AutomatedReading = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden-glow"></div>
    </div>}>
      <AutomatedReadingPage />
    </Suspense>
  );
};

export default AutomatedReading;
