import React from 'react';
import Image from 'next/image';
import { CareerHeroBG } from '@/components/assets';
import { Button } from '@/components/ui/button';

const jobs = [
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

export default function CareerPage() {
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
          Job Openings List
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="shadow-lg p-6 flex flex-col justify-between"
            >
              <div className="border-b border-[#D9D9D9] pb-4">
                <p className="text-[#848D8A] text-size-small font-normal mb-4">
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
