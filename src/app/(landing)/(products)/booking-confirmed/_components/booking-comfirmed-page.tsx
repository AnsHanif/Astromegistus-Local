'use client';

import React from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import ReadingSessionCard from './reading-card-session';

const BookingConfirmedPage = () => {
  return (
    <ProductInfoHeader title="Booked Readings">
      <div className="flex flex-col items-center justify-center text-center py-12">
        {/* Heading */}
        <h2 className="text-size-heading md:text-size-primary font-bold mt-6">
          Your Readings Are Booked!
        </h2>
        <p className="mt-2 text-sm">
          Thank you for your purchase. Your cosmic journey begins now.
        </p>
      </div>

      {/* Reading Session Card */}
      <div className="py-8">
        <h2 className="font-semibold mb-4">Instant Readings Available Now</h2>
        <ReadingSessionCard
          title="AstroBlueprint"
          type="reading"
          label="Natal Reading"
          duration="60 - 90 min"
          actionText="Get Reading"
          onAction={() => alert('Get Reading clicked')}
        />

        <h2 className="font-semibold mt-8 mb-4">Scheduled Live Sessions (1)</h2>
        <ReadingSessionCard
          title="Your Next 12 Months"
          type="session"
          label="Predictive"
          duration="90 - 120 min"
          actionText="View Session"
          onAction={() => alert('View Session clicked')}
        />
      </div>
    </ProductInfoHeader>
  );
};

export default BookingConfirmedPage;
