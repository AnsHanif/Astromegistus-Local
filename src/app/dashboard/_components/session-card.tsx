'use client';
import React, { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Download, Eye, Radio } from 'lucide-react';

interface SessionCardProps {
  type: string;
}

export default function SessionCard({ type }: SessionCardProps): JSX.Element {
  return (
    <div className="my-4 py-6 px-4 sm:px-8 bg-[var(--bg)] text-white shadow-lg flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="md:text-size-large font-semibold">
            Your Next 12 Months
          </h2>
          <span className="text-sm font-normal px-4 py-1.5 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black w-fit">
            Predictive
          </span>
        </div>
        <span className="text-sm font-normal px-4 py-1.5 bg-gradient-to-r from-[#7B3470] to-[#E19D45] flex items-center gap-2 w-fit">
          {type === 'preparing' ? (
            <>
              <span className="animate-spin">↻</span> Preparing
            </>
          ) : (
            <>
              <Radio className="h-4 w-4" /> Completed
            </>
          )}
        </span>
      </div>

      <p className="text-sm">Live Session with Sara Chen</p>

      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4" /> 90 + 30 min
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between text-sm max-w-lg">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4" />{' '}
          {type === 'preparing' ? 'Joined On' : 'Completed'}
        </div>
        <span>Aug 15, 2025, 2:00 PM (EST)</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
        {type === 'preparing' ? (
          <Button className="flex items-center gap-2 flex-1 text-black" disabled>
            <Radio /> Join Session
          </Button>
        ) : (
          <Button
            className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black"
            onClick={() => window.location.href = '/dashboard/view-reading'}
          >
            <Eye className="h-5 w-5" /> View Reading
          </Button>
        )}

        <Button className="flex items-center justify-center gap-2 flex-1 bg-transparent text-golden-glow  border border-golden-glow">
          {type === 'preparing' ? (
            'Rescheduled'
          ) : (
            <>
              <Download className="h-5 w-5" /> Download PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
