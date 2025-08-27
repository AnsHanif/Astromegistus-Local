'use client';

import React from 'react';
import ProductHighlightSection from './product-hightlight-section';
import ProductOverview from './product-overview';
import WhatsIncluded from './whats-included';
import ExploreAstroCoaching from './explore-astro-coaching';
import ProductPricingInfo from './product-pricing-info';
import SectionDivider from './section-divider';
import TestimonialSlider from './testimonial-slider';
import { useRouter } from 'next/navigation';

const ProductDetailPage = () => {
  const route = useRouter();
  const product = {
    id: '1',
    name: 'Herval Shampoo',
    price: 24, // better store as number
    location: 'lahore',
  };

  const addToCart = () => {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    // check if product already exists in cart
    const exists = cart.some((item: any) => item.id === product.id);

    if (!exists) {
      cart.push(product);

      localStorage.setItem('cart', JSON.stringify(cart));

      route.replace('/products');
    } else {
      console.log('Product already in cart!');
    }
  };

  return (
    <div>
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-6 md:py-10 space-y-6">
        <ProductHighlightSection
          title="Soul => Life Path => Current Situation => Path Forward"
          badge="Core / Integrative"
          description="Full karmic to present arc incl. draconic, evolutionary, traditional + psychological charts,
predictive cycles, fixed stars • 2 automated readings • 1 follow-up live session • 30 min coaching"
          time="150 min + 30 min prep"
          image="/product-detail-image.png"
        />

        <ProductOverview />
        <WhatsIncluded />
        <SectionDivider
          classNames="max-w-[45rem] mt-[2rem]"
          text="Product Price"
        />
        <ProductPricingInfo onClick={addToCart} />
        <TestimonialSlider />
      </div>

      <ExploreAstroCoaching />
    </div>
  );
};

export default ProductDetailPage;
