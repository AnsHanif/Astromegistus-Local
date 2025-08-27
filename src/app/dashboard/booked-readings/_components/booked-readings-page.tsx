'use client';

import React from 'react';
import BookedProducts from './booked-products';

export default function BookedReadingsPage() {
  return (
    <div className="py-10">
      <h1 className="text-size-heading md:text-size-heading font-semibold">
        Recent Booked Readings <span className="text-sm font-medium">(2)</span>
      </h1>

      <div className="py-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-8">
        <BookedProducts
          title="AstroBlueprint"
          description="Traditional + psychological natal (Placidus + Equal); In-depth information about the client’s core nature,  psychology, including, locking in changes from before and after Saturn return"
          tag="Natal Reading"
          duration="60 + 30 min"
          image="/product-card-1.png"
          type="reading"
        />

        <BookedProducts
          title="Your Next 12 Months"
          description="Transits, primary & secondary progressions, retrogrades, eclipses (forecast style), solar return,  with information on times in the coming year that warrant special attention"
          tag="Predictive"
          duration="90 + 30 min"
          image="/product-card-2.png"
          type="live"
        />
      </div>
    </div>
  );
}
