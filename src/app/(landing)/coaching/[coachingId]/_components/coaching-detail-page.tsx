'use client';

import React from 'react';
import CoachingDescription from './coaching-description';
import WhatsIncluded from './whats-included';
import CoachingPricingInfo from './coaching-pricing-info';
import SectionDivider from './section-divider';
import { useRouter } from 'next/navigation';
import { useCoachingSession } from '@/hooks/query/coaching-queries';
import { useGetCoachingSections } from '@/hooks/mutation/coaching-sections-mutations';
import { enqueueSnackbar } from 'notistack';

interface CoachingDetailPageClientProps {
  coachingId: string;
}

const CoachingDetailPage = ({ coachingId }: CoachingDetailPageClientProps) => {
  const router = useRouter();
  const { data: session, isLoading, error } = useCoachingSession(coachingId);

  // Get dynamic coaching sections from backend
  const {
    data: coachingSections,
    isLoading: sectionsLoading,
    error: sectionsError
  } = useGetCoachingSections(coachingId);

  // Use dynamic data from admin panel
  const sectionsToDisplay = coachingSections;

  if (isLoading || sectionsLoading) {
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

  const addToCart = (selectedPackage: any) => {
    // Check if session data is available
    if (!session) {
      enqueueSnackbar('Session information is not available', {
        variant: 'error',
      });
      return;
    }

    // Check if selected package is available
    if (!selectedPackage) {
      enqueueSnackbar('Please select a package', {
        variant: 'error',
      });
      return;
    }

    // Use the discounted price from pricing object if available, otherwise main session price
    const sessionPrice = session.pricing?.discountedPrice || session.price || 0;

    // Check if session price is 0
    if (sessionPrice === 0) {
      enqueueSnackbar('Cannot add free sessions to cart', {
        variant: 'error',
      });
      return;
    }

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    const product = {
      id: session.id,
      sessionId: session.id,
      name: session.title,
      price: sessionPrice, // Using main session price, not selectedPackage.originalPrice
      description: session.description || session.shortDescription,
      duration: session.duration,
      image: session.imageUrl,
      qty: 1,
      type: 'coaching',
    };

    // check if product already exists in cart
    const exists = cart.some((item: any) => item.id === product.id);

    if (!exists) {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));

      // Show toast for addition
      enqueueSnackbar(`${product.name} added to cart`, {
        variant: 'success'
      });

      router.replace('/products');
    } else {
      enqueueSnackbar('This session is already in cart!', {
        variant: 'warning'
      });
    }
  };

  return (
    <div>
      <div className="max-w-[1500px] mx-auto w-full px-4 sm:px-8 py-6 md:py-10 space-y-6">
        <CoachingDescription
          title={session?.title || ''}
          description={session?.description || session?.shortDescription || ''}
          image={session?.imageUrl}
        />

        {/* Key Benefits Section */}
        <SectionDivider
          classNames="max-w-[45rem] my-[3rem]"
          text="Key Benefits"
        />
        {sectionsToDisplay?.keyBenefits && sectionsToDisplay.keyBenefits.length > 0 ? (
          <WhatsIncluded items={sectionsToDisplay.keyBenefits.map(benefit => ({
            title: benefit.title,
            description: benefit.description
          }))} />
        ) : (
          <div className="text-gray-500 text-center py-8">
            No key benefits available for this coaching session
          </div>
        )}

        {/* What You Will Learn Section */}
        <SectionDivider
          classNames="max-w-[45rem] my-[3rem]"
          text="What You Will Learn"
        />
        {sectionsToDisplay?.whatYouWillLearn && sectionsToDisplay.whatYouWillLearn.length > 0 ? (
          <WhatsIncluded items={sectionsToDisplay.whatYouWillLearn.map(item => ({
            title: item.title,
            description: item.description
          }))} />
        ) : (
          <div className="text-gray-500 text-center py-8">
            No learning objectives available for this coaching session
          </div>
        )}

        {/* What's Included Section */}
        <SectionDivider
          classNames="max-w-[45rem] my-[3rem]"
          text="What's included"
        />
        {sectionsToDisplay?.whatsIncluded && sectionsToDisplay.whatsIncluded.length > 0 ? (
          <WhatsIncluded items={sectionsToDisplay.whatsIncluded.map(item => ({
            title: item.title,
            description: item.description
          }))} />
        ) : (
          <div className="text-gray-500 text-center py-8">
            No included features available for this coaching session
          </div>
        )}

        <SectionDivider
          classNames="max-w-[45rem] my-[3rem]"
          text="Coaching Pricing Info"
        />
        <CoachingPricingInfo onClick={addToCart} session={session} />
      </div>
    </div>
  );
};

export default CoachingDetailPage;
