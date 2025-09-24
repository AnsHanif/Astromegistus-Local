'use client';

import React from 'react';
import CoachingCard from './coaching-card';

const CoachingCards = () => {
  return (
    <section className="py-6 flex flex-wrap justify-center gap-4 md:gap-8 mx-auto mt-10">
      <CoachingCard
        href="/coaching/1"
        title="Life Coaches"
        description="Traditional + psychological natal (Placidus + Equal); In-depth information about the client’s core nature,  psychology, including, locking in changes from before and after Saturn return"
        buttonText="View Details"
        duration="60 + 30 min"
        image="/product-card-1.png"
      />

      <CoachingCard
        href="/coaching/2"
        title="Career Coaches"
        description="Transits, primary & secondary progressions, retrogrades, eclipses (forecast style), solar return,  with information on times in the coming year that warrant special attention"
        buttonText="View Details"
        duration="90 + 30 min"
        image="/product-card-2.png"
      />

      <CoachingCard
        href="/coaching/3"
        title="Relationship Coaches"
        description="Career path, life calling, MC focus, Saturn, houses 2/6/10, Chart ruler, MC ruler"
        buttonText="View Details"
        duration="60 + 30 min"
        image="/product-card-3.png"
      />
    </section>
  );
};

export default CoachingCards;
