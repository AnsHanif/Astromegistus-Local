import React from 'react';
import HeroSection from './_components/hero-section';
import ExploreSection from './_components/explore-section';
import NewsLetterSection from './_components/newsletter-section';
import LandingFeatures from './_components/landing-features';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ExploreSection />
      <LandingFeatures />
      <NewsLetterSection />
    </>
  );
}
