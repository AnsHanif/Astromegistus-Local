'use client';

import React from 'react';
import SuccessAnimation from '@/components/common/success-animation';

const Step2AutoScheduled = () => {
  return (
    <div>
      <h3 className="text-size-large md:px-8 md:text-size-heading font-semibold">
        Schedule Your Sessions
      </h3>
      <p className="text-sm md:px-8">
        We'll automatically schedule your sessions at optimal times
      </p>

      <div className="flex flex-col gap-2 my-36 items-center max-w-[40rem] w-full mx-auto">
        <SuccessAnimation />

        <h2 className="text-size-heading md:text-size-primary font-bold">
          Auto-Scheduling Enabled
        </h2>

        <p className="text-center">
          Our system will automatically schedule your 1 session with available
          astrologers at the best possible times based on your preferences.
        </p>
      </div>
    </div>
  );
};

export default Step2AutoScheduled;
