'use client';

import React from 'react';
import ProductCard from './product-card';

const ProductsCards = () => {
  return (
    <section className="py-6 grid grid-cols-1 place-items-center md:grid-cols-2 gap-4 md:gap-8 mx-auto">
      <ProductCard
        href="/products/1"
        title="AstroBlueprint"
        description="Traditional + psychological natal (Placidus + Equal); In-depth information about the client’s core nature,  psychology, including, locking in changes from before and after Saturn return"
        buttonText="View Details"
        tag="Natal Reading"
        duration="60 + 30 min"
        image="/product-card-1.png"
      />

      <ProductCard
        href="/products/2"
        title="Your Next 12 Months"
        description="Transits, primary & secondary progressions, retrogrades, eclipses (forecast style), solar return,  with information on times in the coming year that warrant special attention"
        buttonText="View Details"
        tag="Predictive"
        duration="90 + 30 min"
        image="/product-card-2.png"
      />

      {/* 3 */}
      <ProductCard
        href="/products/3"
        title="Cosmic Vocation Map"
        description="Career path, life calling, MC focus, Saturn, houses 2/6/10, Chart ruler, MC ruler"
        buttonText="View Details"
        tag="Career"
        duration="60 + 30 min"
        image="/product-card-3.png"
      />

      <ProductCard
        href="/products/4"
        title="Yes or No? Who or what?"
        description="Traditional horary astrology: exact question, chart of the moment"
        buttonText="View Details"
        tag="Horary"
        duration="60 + 30 min"
        image="/product-card-4.png"
      />

      <ProductCard
        href="/products/5"
        title="Synergy"
        description="Romantic/personal compatibility, both natal charts discussed separately followed by synastry +  composite"
        buttonText="View Details"
        tag="Natal Reading"
        duration="90 + 30 min"
        image="/product-card-5.png"
      />

      <ProductCard
        href="/products/6"
        title="Where You Thrive"
        description="Relocation energy: interpreting natal chart, pick new location for relocated natal chart overlays, world  map with planetary lines (automatic; one location / live session various locations)"
        buttonText="View Details"
        tag="Astrocartography"
        duration="60 + 30 min"
        image="/product-card-6.png"
      />

      {/* 7 */}
      <ProductCard
        href="/products/7"
        title="Launch Window Reading"
        description="Ideal dates for launches, events, branding, weddings, purchases, etc."
        buttonText="View Details"
        tag="Electional"
        duration="60 + 30 min"
        image="/product-card-7.png"
      />

      <ProductCard
        href="/products/8"
        title="Soul Overlay Reading"
        description="The soul and its role in this life; draconic + natal-to-draconic overlay: karmic interface, soul integration  themes"
        buttonText="View Details"
        tag="Draconic + Natal  Overlay"
        duration="60 + 30 min"
        image="/product-card-8.png"
      />

      <ProductCard
        href="/products/9"
        title="Rectification"
        description="For anyone who only knows an approximate time of birth or event time"
        buttonText="View Details"
        tag="Natal"
        duration="90 + 30 min"
        image="/product-card-9.png"
      />

      <ProductCard
        href="/products/10"
        title="Where You Thrive"
        description="Relocation energy: interpreting natal chart, pick new location for relocated natal chart overlays, world  map with planetary lines (automatic; one location / live session various locations)"
        buttonText="View Details"
        tag="Astrocartography"
        duration="60 + 30 min"
        image="/product-card-10.png"
      />
    </section>
  );
};

export default ProductsCards;
