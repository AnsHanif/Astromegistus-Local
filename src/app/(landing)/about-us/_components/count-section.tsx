'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioIcon, ListenLiveIcon, DateIcon, TimeIcon, UsersIcon } from '@/components/assets';
import { useRadioShows } from '@/hooks/query/radio-show-queries';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CountSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch multiple active radio shows
  const { data: radioShowsResponse, isLoading, error } = useRadioShows({
    page: 1,
    limit: 10,
  });

  // Extract and sort radio shows array by date (ascending order)
  const radioShows = (radioShowsResponse?.data?.data?.radioShows || []).sort((a: any, b: any) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  const currentRadioShow = radioShows[currentIndex];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark min-h-80 px-4 sm:px-12 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RadioIcon className="font-lato font-normal" />
            <span className="text-5xl font-lato font-bold">
              Today's Radio Show
            </span>
          </div>
          <div className="text-size-medium font-lato">Loading...</div>
        </div>
      </div>
    );
  }

  // Show error or no radio show state
  if (error || !currentRadioShow || radioShows.length === 0) {
    return (
      <div className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark min-h-80 px-4 sm:px-12 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RadioIcon className="font-lato font-normal" />
            <span className="text-5xl font-lato font-bold">
              Today's Radio Show
            </span>
          </div>
          <div className="text-size-medium font-lato">
            {error ? 'Unable to load radio show information' : 'No radio shows scheduled'}
          </div>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? radioShows.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === radioShows.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark min-h-80 px-4 sm:px-12 py-12 flex items-center justify-center relative">
      {/* Previous Button */}
      {radioShows.length > 1 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 bg-emerald-green hover:bg-emerald-green/90 text-white rounded-full p-2 sm:p-3 transition-all shadow-lg z-10"
          aria-label="Previous radio show"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <RadioIcon className="font-lato font-normal" />
          <span className="text-5xl font-lato font-bold">
            Today's Radio Show
          </span>
        </div>

        <h1 className="text-size-large font-lato font-semibold mb-4">
          {currentRadioShow.showTitle}
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-24 md:gap-36 lg:gap-48 xl:gap-56 mb-6 text-size-medium font-lato font-normal">
          <div className="flex items-center gap-2">
            <DateIcon width="20" height="20" className="font-lato font-normal" />
            <span className="font-lato font-normal">{formatDate(currentRadioShow.date)}</span>
          </div>
          <div className="flex items-center gap-2 sm:mr-4 md:mr-8 lg:mr-12">
            <TimeIcon width="20" height="20" className="font-lato font-normal" />
            <span className="font-lato font-normal">{currentRadioShow.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon width="20" height="20" className="font-lato font-normal" />
            <span className="font-lato font-normal">{currentRadioShow.hostName}</span>
          </div>
        </div>

        <Button
          className="bg-emerald-green text-white w-40 h-12 sm:w-44 sm:h-14"
          onClick={() => window.open(currentRadioShow.link, '_blank', 'noopener,noreferrer')}
        >
          <ListenLiveIcon className="mr-2 font-lato font-normal" width="16" height="16" />
          Listen Live
        </Button>

        {/* Carousel Indicators */}
        {radioShows.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {radioShows.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-emerald-green w-6'
                    : 'bg-black/30 hover:bg-black/50'
                }`}
                aria-label={`Go to radio show ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Next Button */}
      {radioShows.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 bg-emerald-green hover:bg-emerald-green/90 text-white rounded-full p-2 sm:p-3 transition-all shadow-lg z-10"
          aria-label="Next radio show"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
}
