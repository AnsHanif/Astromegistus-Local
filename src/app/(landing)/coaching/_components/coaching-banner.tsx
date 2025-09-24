import React from 'react';
import Image from 'next/image';

const CoachingBannerSection = () => {
  return (
    <div>
      <div className="relative h-[600px] w-full">
        <Image
          src="/product-banner.png"
          alt="banner"
          fill
          className="object-cover"
        />
      </div>

      <p className="md:text-size-medium text-center">
        Meet H.T. - Your Guide to the Stars
      </p>
    </div>
  );
};

export default CoachingBannerSection;
