import React from 'react';
import Image from 'next/image';
import { YellowStars } from '@/components/assets';

export default function ExploreSection() {
  const features = [
    'Lorem ipsum dolor sit amet consectetur.',
    'Lorem ipsum dolor sit amet consectetur.',
    'Lorem ipsum dolor sit amet consectetur.',
    'Lorem ipsum dolor sit amet consectetur.',
    'Lorem ipsum dolor sit amet consectetur.',
    'Lorem ipsum dolor sit amet consectetur.',
    'Lorem ipsum dolor sit amet consectetur.',
    'Lorem ipsum dolor sit amet consectetur.',
  ];

  return (
    <section className="px-4 sm:px-12 py-16 bg-white text-black text-center">
      <h1 className="text-size-heading md:text-size-primary font-bold">
        Explore Your Cosmic Readings & Sessions
      </h1>

      <p className="mt-2 text-base max-w-[700px] mx-auto">
        From AI-powered automated readings to live sessions with expert
        astrologers, discover the perfect cosmic guidance for your journey
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="relative h-[600px] w-full">
            <Image
              src="/product-banner.png"
              alt="Cosmic Video"
              fill
              className="object-cover shadow-lg"
            />
          </div>
          <p className="md:text-size-medium text-center mt-2">
            Meet H.T. - Your Guide to the Stars
          </p>
        </div>

        <div className="flex flex-col justify-center items-start">
          <h1 className="text-size-heading md:text-size-primary font-bold mb-6">
            Key Features
          </h1>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Image
                  src={YellowStars}
                  alt="Star Icon"
                  width={24}
                  height={24}
                />
                <span className="text-base font-normal mt-0.5 text-start">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
