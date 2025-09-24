'use client';

import React from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import ReadingSessionCard from './reading-card-session';
import { Button } from '@/components/ui/button';
import SuccessAnimation from '@/components/common/success-animation';
import { useRouter } from 'next/navigation';

const BookingConfirmedPage = () => {
  const router = useRouter();
  return (
    <ProductInfoHeader title="Booked Readings">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        {/* Heading */}
        <SuccessAnimation />
        <h2 className="text-size-heading md:text-size-primary font-bold mt-4">
          Your Readings Are Booked!
        </h2>
        <p className="mt-2 text-sm">
          Thank you for your purchase. Your cosmic journey begins now.
        </p>
      </div>

      {/* Reading Session Card */}
      <div>
        <h2 className="text-size-large md:text-size-heading font-medium mb-2">
          Instant Readings Available Now <span className="text-sm">(1)</span>
        </h2>
        <ReadingSessionCard
          title="AstroBlueprint"
          type="reading"
          label="Natal Reading"
          duration="60 - 90 min"
          actionText="Get Reading"
          classNames="mb-6"
          href="/products/flow/automated-reading"
        />

        <h2 className="text-size-large md:text-size-heading font-medium mb-2">
          Scheduled Live Sessions<span className="text-sm">(1)</span>
        </h2>
        <ReadingSessionCard
          title="Your Next 12 Months"
          type="session"
          label="Predictive"
          duration="90 - 120 min"
          actionText="View Session"
          classNames="mb-8"
          href="/products/flow/manual-reading"
        />

        <h2 className="text-size-large md:text-size-heading font-medium mb-2">
          Scheduled Coaching Sessions<span className="text-sm">(1)</span>
        </h2>
        <ReadingSessionCard
          title="Life Coaching"
          type="session"
          duration="60 - 90 min"
          actionText="View Session"
          classNames="mb-8"
          href="/products/flow/coaching-sessions"
        />

        <div className="space-y-4">
          <Button
            className="w-full bg-emerald-green border-emerald-green text-white"
            variant={'outline'}
          >
            Book More Readings
          </Button>

          <Button className="w-full" variant={'outline'}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </ProductInfoHeader>
  );
};

export default BookingConfirmedPage;
