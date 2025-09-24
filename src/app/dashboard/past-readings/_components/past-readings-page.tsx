'use client';
import React, { useState, useEffect } from 'react';
import SessionCard from '../../_components/session-card';
import { usePastReadings } from '@/hooks/query/booking-queries';
import { enqueueSnackbar } from 'notistack';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { Button } from '@/components/ui/button';
import { Clock, Download, Eye, Radio } from 'lucide-react';

export default function PastReadingsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: readingsData,
    isLoading,
    error,
  } = usePastReadings({ page, limit });

  // Show error toast and treat as empty data
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Failed to load past readings', {
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
            <span>Loading past readings...</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to empty data if there are errors
  const readings = error ? [] : readingsData?.readings || [];
  const totalReadings = error ? 0 : readingsData?.pagination.total || 0;

  const ReadingCard = ({ reading }: { reading: any }) => (
    <div className="my-4 py-6 px-4 sm:px-8 bg-[var(--bg)] text-white shadow-lg flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="md:text-size-large font-semibold">
            {reading.productName}
          </h2>
          <span className="text-sm font-normal px-4 py-1.5 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black w-fit">
            {reading.categories.length > 0 ? reading.categories[0] : 'Reading'}
          </span>
        </div>
        <span className="text-sm font-normal px-4 py-1.5 bg-gradient-to-r from-[#7B3470] to-[#E19D45] flex items-center gap-2 w-fit">
          <Radio className="h-4 w-4" /> Completed
        </span>
      </div>

      <p className="text-sm">{reading.productDescription || 'No description available'}</p>

      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4" /> {reading.duration}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between text-sm max-w-lg">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4" /> Completed
        </div>
        <span>
          {reading.completedAt 
            ? new Date(reading.completedAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : ''
          }
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
        <Button
          className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black"
          onClick={() => window.location.href = '/dashboard/view-reading'}
        >
          <Eye className="h-5 w-5" /> View Reading
        </Button>

        <Button className="flex items-center justify-center gap-2 flex-1 bg-transparent text-golden-glow border border-golden-glow">
          <Download className="h-5 w-5" /> Download PDF
        </Button>
      </div>
    </div>
  );

  return (
    <div className="py-10">
      <h1 className="text-size-heading md:text-size-heading font-semibold">
        Past Readings <span className="text-sm font-medium">({totalReadings})</span>
      </h1>

      {readings.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-400 text-lg">No past readings found</p>
          <p className="text-gray-500 text-sm mt-2">Your completed readings will appear here</p>
        </div>
      ) : (
        <div>
          {readings.map((reading) => (
            <ReadingCard key={reading.id} reading={reading} />
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
