'use client';

import React from 'react';
import CoachingDescription from './coaching-description';
import WhatsIncluded from './whats-included';
import CoachingPricingInfo from './coaching-pricing-info';
import SectionDivider from './section-divider';
import { useRouter } from 'next/navigation';
import { useCoachingSession } from '@/hooks/query/coaching-queries';

interface CoachingDetailPageClientProps {
  coachingId: string;
}

const CoachingDetailPage = ({ coachingId }: CoachingDetailPageClientProps) => {
  const router = useRouter();
  const { data: session, isLoading, error } = useCoachingSession(coachingId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden-glow"></div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">
          Error loading coaching session. Please try again.
        </div>
      </div>
    );
  }

  const addToCart = () => {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    const product = {
      id: session.id,
      name: session.title,
      price: session.price,
      type: 'coaching',
    };

    // check if product already exists in cart
    const exists = cart.some((item: any) => item.id === product.id);

    if (!exists) {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      router.replace('/coaching');
    } else {
      console.log('Coaching session already in cart!');
    }
  };

  return (
    <div>
      <div className="max-w-[1500px] mx-auto w-full px-4 sm:px-8 py-6 md:py-10 space-y-6">
        <CoachingDescription
          title={session.title}
          description={session.description || session.shortDescription}
          image={session.imageUrl || '/product-detail-image.png'}
        />

        <SectionDivider
          classNames="max-w-[45rem] my-[3rem]"
          text="What’s included"
        />
        <WhatsIncluded items={session.features.map(feature => ({ title: feature }))} />
        <SectionDivider
          classNames="max-w-[45rem] my-[3rem]"
          text="Coaching Pricing Info"
        />
        <CoachingPricingInfo onClick={addToCart} />
      </div>
    </div>
  );
};

export default CoachingDetailPage;
