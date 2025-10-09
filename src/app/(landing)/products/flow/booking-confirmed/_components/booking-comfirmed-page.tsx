'use client';

import React from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import SuccessAnimation from '@/components/common/success-animation';
import Link from 'next/link';
import InstantReading from './instant-reading';
import ScheduledSession from './scheduled-session';
import CoachingSessions from './coaching-sessions';

const BookingConfirmedPage = () => {
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
        <InstantReading />
        <ScheduledSession />
        <CoachingSessions />

        <div className="space-y-4">
          <Link
            href="/products"
            className="w-full h-12 md:h-15 bg-emerald-green hover:bg-emerald-green/95 border border-emerald-green text-white flex items-center justify-center"
          >
            Book More Readings
          </Link>

          <Link
            href="/dashboard/booked-readings"
            className="w-full h-12 md:h-15 hover:bg-grey-light-50 border flex items-center justify-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </ProductInfoHeader>
  );
};

export default BookingConfirmedPage;
