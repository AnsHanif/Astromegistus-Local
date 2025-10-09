'use client';

import React from 'react';
import { Info } from 'lucide-react';
import Image from 'next/image';

interface IncludedFeature {
  id?: string;
  title: string;
  description?: string;
  order: number;
}

interface WhatsIncludedProps {
  items?: IncludedFeature[];
  imageSrc?: string;
}

const WhatsIncluded: React.FC<WhatsIncludedProps> = ({
  items,
  imageSrc = '/whats-include.png',
}) => {
  return (
    <section className="w-full bg-white flex flex-col-reverse justify-between md:flex-row gap-8 items-start">
      <div>

        {/* Items */}
        <div className="space-y-6">
          {!items || items.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No features available
            </div>
          ) : (
            items.map((item, index) => (
              <div key={item.id || index} className="flex gap-3">
                <div>
                  <h4 className="text-base font-bold mb-1">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-base">{item.description}</p>
                  )}
                </div>
              </div>
            ))
          )}
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
