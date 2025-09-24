'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { CareerHeroBG } from '@/components/assets';
import { Button } from '@/components/ui/button';

const freelanceJobs = [
  {
    id: 1,
    posted: '1 Day Ago',
    title: 'Natal Astrologer',
    tags: ['Mon-Wed', 'Senior'],
    description:
      'Lorem ipsum dolor sit amet consectetur. Id eu eu neque egestas bibendum vel amet id montes. Nulla enim porttitor lorem pretium. Tellus cras dictum mi nulla.',
  },
  {
    id: 2,
    posted: '1 Day Ago',
    title: 'Natal Astrologer',
    tags: ['Mon-Wed', 'Senior'],
    description:
      'Lorem ipsum dolor sit amet consectetur. Id eu eu neque egestas bibendum vel amet id montes. Nulla enim porttitor lorem pretium. Tellus cras dictum in nulla.',
  },
  {
    id: 3,
    posted: '1 Day Ago',
    title: 'Natal Astrologer',
    tags: ['Mon-Wed', 'Senior'],
    description:
      'Lorem ipsum dolor sit amet consectetur. Id eu eu neque egestas bibendum vel amet id montes. Nulla enim porttitor lorem pretium. Tellus cras dictum mi nulla.',
  },
];

const employmentJobs = [
  {
    id: 4,
    posted: '2 Days Ago',
    title: 'Senior Astrologer',
    tags: ['Full-Time', 'Senior'],
    description:
      'Lorem ipsum dolor sit amet consectetur. Id eu eu neque egestas bibendum vel amet id montes. Nulla enim porttitor lorem pretium. Tellus cras dictum mi nulla.',
  },
  {
    id: 5,
    posted: '3 Days Ago',
    title: 'Tarot Reader',
    tags: ['Part-Time', 'Mid-Level'],
    description:
      'Lorem ipsum dolor sit amet consectetur. Id eu eu neque egestas bibendum vel amet id montes. Nulla enim porttitor lorem pretium. Tellus cras dictum in nulla.',
  },
];

export default function CareerPage() {
  const [activeTab, setActiveTab] = useState('freelance');
  const currentJobs = activeTab === 'freelance' ? freelanceJobs : employmentJobs;

  return (
    <div className="">
      <h1 className="text-size-primary md:text-size-heading-2xl text-center font-bold leading-tight px-4 sm:px-12 py-16">
        Innovators Wanted; Join <br />
        The Wises Revolution
      </h1>

      <Image
        src={CareerHeroBG}
        alt="Innovators Wanted; Join The Wises Revolution"
        className="w-full h-full object-contain"
      />

      <div className="px-4 sm:px-12 py-16">
        <h2 className="text-size-heading md:text-size-primary font-bold mb-8">
          Job & Career Openings
        </h2>

        <div className="mb-8">
          <div className="flex gap-4 sm:gap-8">
            <button
              onClick={() => setActiveTab('freelance')}
              className={`px-3 py-2 sm:px-4 sm:py-3 font-semibold text-size-secondary sm:text-size-medium transition-colors ${
                activeTab === 'freelance'
                  ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark bg-clip-text text-transparent'
                  : 'text-charcoal hover:text-golden-glow'
              }`}
            >
              Freelance
            </button>
            <button
              onClick={() => setActiveTab('employment')}
              className={`px-3 py-2 sm:px-4 sm:py-3 font-semibold text-size-secondary sm:text-size-medium transition-colors ${
                activeTab === 'employment'
                  ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark bg-clip-text text-transparent'
                  : 'text-charcoal hover:text-golden-glow'
              }`}
            >
              Employment
            </button>
          </div>
          <div className="border-b border-charcoal mt-2"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="shadow-lg p-6 flex flex-col justify-between"
            >
              <div className="border-b border-[#D9D9D9] pb-4">
                <p className="text-grey text-size-small font-normal mb-4">
                  {job.posted}
                </p>
                <h1 className="text-size-medium md:text-size-heading font-semibold">
                  {job.title}
                </h1>

                <div className="flex gap-2 my-2">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-size-tertiary font-normal px-3 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-size-tertiary font-normal my-6">
                  {job.description}
                </p>
              </div>

              <Button
                variant="default"
                className="w-full xs:w-44 h-12 md:h-12 bg-emerald-green text-white mt-6 mx-auto"
                onClick={() => window.open(`mailto:hr@astromegistus.com?subject=Job Application - ${job.title}&body=Hello,%0D%0A%0D%0AI am interested in applying for the ${job.title} position.%0D%0A%0D%0AThank you for your consideration.%0D%0A%0D%0ABest regards,`, '_self')}
              >
                Apply Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
