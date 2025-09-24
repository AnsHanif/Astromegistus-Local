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
        <Image src={image} alt="Section image" fill className="object-cover" />
      </div>

      {/* Centered title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
        {title}
      </h2>

      {/* Service Description Section */}
      <div className="">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Service Description
        </h3>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
};

export default CoachingDescription;
