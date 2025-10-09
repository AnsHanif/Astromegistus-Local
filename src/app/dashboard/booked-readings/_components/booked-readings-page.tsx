'use client';

import React, { useState, useEffect } from 'react';
import BookedProducts from './booked-products';
import { useRecentReadings } from '@/hooks/query/booking-queries';
import { enqueueSnackbar } from 'notistack';
import SectionLoader from '@/components/common/section-loader';
import { useRouter } from 'next/navigation';

export default function BookedReadingsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const router = useRouter();

  const {
    data: readingsData,
    isLoading,
    error,
  } = useRecentReadings({ page, limit });

  // Show error toast and treat as empty data
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Failed to load recent readings', {
        variant: 'error',
      });
    }
  }, [error]);

  // Loading state - only show if data is loading and we don't have any data yet
  if (isLoading && !readingsData) {
    return (
      <div className="py-10">
        <SectionLoader
          message="Loading recent readings..."
          className="min-h-[400px]"
          size={40}
          color="#D4AF37"
        />
      </div>
    );
  }

  // Fallback to empty data if there are errors
  const readings = error ? [] : readingsData?.readings || [];
  const totalReadings = error ? 0 : readingsData?.pagination.total || 0;

  const handleReschedule = (sessionId: string, bookingId: string) => {
    router.push(
      `/products/flow/reschedule?sessionId=${sessionId}&bookingId=${bookingId}&type=reading`
    );
  };

  return (
    <div className="py-10">
      <h1 className="text-size-heading md:text-size-heading font-semibold">
        Recent Booked Readings{' '}
        <span className="text-sm font-medium">({totalReadings})</span>
      </h1>

      {readings.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-400 text-lg">No recent readings found</p>
          <p className="text-gray-500 text-sm mt-2">
            Your upcoming readings will appear here
          </p>
        </div>
      ) : (
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-8">
          {readings.map((reading) => (
            <BookedProducts
              key={reading.id}
              title={reading.productName}
              description={
                reading.productDescription || 'No description available'
              }
              tag={
                reading.categories?.length > 0
                  ? reading.categories[0]
                  : 'Reading'
              }
              duration={reading.duration}
              image="/product-card-1.png" // Default image, could be made dynamic
              type={reading.type === 'AUTOMATED' ? 'reading' : 'live'}
              meetingLink={reading.meetingLink}
              meetingId={reading.meetingId}
              meetingStatus={reading.meetingStatus}
              selectedDate={reading.selectedDate}
              selectedTime={reading.selectedTime}
              timezone={reading.userTimezone}
              bookingId={reading.id}
              sessionId={reading.productId} // Using bookingId as sessionId for now
              onReschedule={handleReschedule}
            />
          ))}
        </div>
      )}

      {/* Pagination could be added here if needed */}
      {readingsData?.pagination && readingsData.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-white">
            Page {page} of {readingsData.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === readingsData.pagination.totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
