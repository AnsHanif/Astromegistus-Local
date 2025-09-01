import React from 'react';
import AboutUsHero from './about-us-hero';
import AboutUsMission from './about-us-mission';
import HowWeWork from './how-we-work';
import MeetOurTeam from './meet-our-team';
import CountSection from './count-section';
import StartJourneySection from './start-journey-section';
import TestimonialSlider from '../../products/[productId]/_components/testimonial-slider';

export default function AboutUsPage() {
  return (
    <>
      <AboutUsHero />
      <AboutUsMission />
      <HowWeWork />
      <MeetOurTeam />
      <CountSection />
      <div className="px-4 sm:px-12 py-8 md:py-6">
        <TestimonialSlider />
      </div>
      <StartJourneySection />
    </>
  );
}
