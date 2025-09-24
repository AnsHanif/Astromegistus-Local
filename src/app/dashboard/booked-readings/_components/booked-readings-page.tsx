'use client';

import React, { useState, useEffect } from 'react';
import BookedProducts from './booked-products';
import { useRecentReadings } from '@/hooks/query/booking-queries';
import { enqueueSnackbar } from 'notistack';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';

export default function BookedReadingsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-white">
            <SpinnerLoader size={20} color="#ffffff" />
            <span>Loading recent readings...</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to empty data if there are errors
  const readings = error ? [] : readingsData?.readings || [];
  const totalReadings = error ? 0 : readingsData?.pagination.total || 0;

  return (
    <div className="py-10">
      <h1 className="text-size-heading md:text-size-heading font-semibold">
        Recent Booked Readings <span className="text-sm font-medium">({totalReadings})</span>
      </h1>

      {readings.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-400 text-lg">No recent readings found</p>
          <p className="text-gray-500 text-sm mt-2">Your upcoming readings will appear here</p>
        </div>
      ) : (
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-8">
          {readings.map((reading) => (
            <BookedProducts
              key={reading.id}
              title={reading.productName}
              description={reading.productDescription || 'No description available'}
              tag={reading.categories.length > 0 ? reading.categories[0] : 'Reading'}
              duration={reading.duration}
              image="/product-card-1.png" // Default image, could be made dynamic
              type={reading.type === 'AUTOMATED' ? 'reading' : 'live'}
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
