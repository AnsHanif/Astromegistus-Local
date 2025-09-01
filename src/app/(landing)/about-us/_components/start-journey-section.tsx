import React from 'react';
import { StartJourneyBG } from '@/components/assets';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function StartJourneySection() {
  return (
    <div
      className="min-h-[300px] bg-cover bg-center text-white px-4 sm:px-12 flex flex-col items-center justify-center text-center gap-4 py-12 sm:py-0"
      style={{ backgroundImage: `url(${StartJourneyBG.src})` }}
    >
      <h1 className="text-size-heading md:text-size-primary font-bold max-w-4xl leading-tight">
        Ready For A Reading That Respects Your Time And Empowers Your Journey?
      </h1>

      <Button variant="default" className="w-full xs:w-55 text-black">
        Start Your Journey
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </div>
  );
}
