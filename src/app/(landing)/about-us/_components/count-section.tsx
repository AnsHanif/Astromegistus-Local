import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioIcon, ListenLiveIcon, DateIcon, TimeIcon, UsersIcon } from '@/components/assets';

export default function CountSection() {
  return (
    <div className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark min-h-80 px-4 sm:px-12 py-12 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <RadioIcon className="font-lato font-normal" />
          <span className="text-size-heading md:text-size-primary font-lato font-bold">
            Today's Radio Show
          </span>
        </div>

        <h1 className="text-size-large font-lato font-semibold mb-4">
          Overcome Stress
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 md:gap-16 lg:gap-24 xl:gap-32 mb-6 text-size-medium font-lato font-normal">
          <div className="flex items-center gap-2">
            <DateIcon width="20" height="20" className="font-lato font-normal" />
            <span className="font-lato font-normal">October 17, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <TimeIcon width="20" height="20" className="font-lato font-normal" />
            <span className="font-lato font-normal">11:00 AM EST</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon width="20" height="20" className="font-lato font-normal" />
            <span className="font-lato font-normal">Pair Tauett & Dener</span>
          </div>
        </div>

        <Button className="bg-emerald-green text-white w-40 h-12 sm:w-44 sm:h-14">
          <ListenLiveIcon className="mr-2 font-lato font-normal" width="16" height="16" />
          Listen Live
        </Button>
      </div>
    </div>
  );
}
