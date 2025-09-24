import React from 'react';
import CoachingHeader from './coaching-header';
import CoachingCards from './coaching-cards';
import CartItems from './cart-items';
import CoachingBannerSection from './coaching-banner';

const CoachingPage = () => {
  return (
    <div className="px-4 sm:px-8 mx-auto">
      <CoachingHeader />
      <CartItems />
      <CoachingBannerSection />
      <CoachingCards />
    </div>
  );
};

export default CoachingPage;
