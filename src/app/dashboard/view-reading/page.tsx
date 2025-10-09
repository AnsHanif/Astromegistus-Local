'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ViewReadingPage from './_components/view-reading-page';
import SectionLoader from '@/components/common/section-loader';

function ViewReadingContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as 'reading' | 'session' || 'reading';

  return <ViewReadingPage type={type} />;
}

export default function ViewReading() {
  return (
    <Suspense fallback={
      <div className="py-10">
        <SectionLoader
          message="Loading page..."
          className="min-h-[400px]"
          size={40}
          color="#D4AF37"
        />
      </div>
    }>
      <ViewReadingContent />
    </Suspense>
  );
}