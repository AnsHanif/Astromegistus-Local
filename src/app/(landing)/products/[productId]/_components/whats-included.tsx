'use client';

import React from 'react';
import { Info } from 'lucide-react';
import Image from 'next/image';

interface WhatsIncludedProps {
  items?: {
    title: string;
    description?: string;
  }[];
  imageSrc?: string;
}

const WhatsIncluded: React.FC<WhatsIncludedProps> = ({
  items = [
    {
      title: '60 Min Follow-Up',
      description:
        'A full hour follow-up session to review your results, answer questions, and provide additional guidance.',
    },
    {
      title: '2 Automated Readings Of Choice',
      description:
        'Select two from automated readings from our available options to complement your live session.',
    },
    {
      title: '30 Min Coaching Of Choice',
      description:
        'A personalized video or audio coaching session tailored to your specific needs and goals.',
    },
    {
      title: 'Delivery Method',
      description:
        'Live session via video call. PDF report delivered to your email and accessible on your dashboard.',
    },
  ],
  imageSrc = '/whats-include.png',
}) => {
  return (
    <section className="w-full bg-white flex flex-col-reverse justify-between md:flex-row gap-8 items-start">
      <div>
        <div className="mb-6 space-y-1">
          <div className="flex gap-2">
            <Info className="w-5 h-5 text-black mt-1.5" />
            <h4 className="font-medium text-size-large md:text-size-heading mb-1">
              120 min Live Session + 60 min Prep
            </h4>
          </div>
          <p className="text-sm">
            A dedicated live session with your astrologer, preceded by 60
            minutes of in-depth chart preparation.
          </p>
        </div>

        {/* Items */}
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3">
              <div>
                <h4 className="font-medium text-size-large md:text-size-heading mb-1">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-sm">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Illustration */}
      </div>
      <div className="flex justify-center md:mt-12 mx-auto md:mx-0">
        <Image
          src={imageSrc}
          alt="What's included illustration"
          width={330}
          height={330}
          className="object-contain"
        />
      </div>
    </section>
  );
};

export default WhatsIncluded;
