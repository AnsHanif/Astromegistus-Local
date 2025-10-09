'use client';

import { FC } from 'react';
import Image from 'next/image';
import SectionDivider from './section-divider';

interface CoachingDescriptionProps {
  title: string;
  description: string;
  image: string;
}

const CoachingDescription: FC<CoachingDescriptionProps> = ({
  title,
  description,
  image,
}) => {
  return (
    <section>
      {/* Full-width image */}
      <div className="relative h-[300px] md:h-[513px] w-full mb-8">
        {image && image !== '' ? (
          <Image src={image} alt="Section image" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {/* Centered title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
        {title}
      </h2>

      {/* Service Description Section */}
      <div className="">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Service Description
        </h3>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p className="text-base">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default CoachingDescription;
