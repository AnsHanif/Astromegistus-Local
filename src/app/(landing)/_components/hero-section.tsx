import React from 'react';
import { HeroBG } from '@/components/assets';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function HeroSection() {
  return (
    <div
      className="h-[600px] bg-cover bg-center text-white px-4 sm:px-8 flex flex-col items-center justify-center text-center"
      style={{ backgroundImage: `url(${HeroBG.src})` }}
    >
      <h1 className="text-size-primary md:text-size-heading-2xl font-bold leading-tight">
        <span className="bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] bg-clip-text text-transparent">
          Unlock Your
        </span>
        <br /> Cosmic Blueprint
      </h1>
      <p className="py-2 font-semibold max-w-[800px] md:text-size-medium">
        AI-Enhanced Astrology Readings, Live Sessions With Expert Astrologers,
        And Personalized Coaching To Guide Your Celestial Journey
      </p>

      <Button
        variant="default"
        className="bg-emerald-green mt-7 min-w-64 md:min-w-80 flex items-center justify-center gap-3"
      >
        Explore Astromegistus
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </div>
  );
}
