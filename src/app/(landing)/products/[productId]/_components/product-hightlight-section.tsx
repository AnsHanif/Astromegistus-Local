'use client';

import { FC } from 'react';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import SectionDivider from './section-divider';

interface ProductHighlightSectionProps {
  title: string;
  badge: string;
  description: string;
  time: string;
  image: string;
}

const ProductHighlightSection: FC<ProductHighlightSectionProps> = ({
  title,
  badge,
  description,
  time,
  image,
}) => {
  return (
    <section>
      <div className="flex flex-col-reverse items-stretch md:flex-row gap-8">
        {/* Left content */}
        <div className="flex-1 space-y-4 md:mt-12 h-full">
          {/* <div className="flex-1 space-y-4 md:mt-12 h-full"> */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
            {title}
          </h2>
          <p className="bg-gradient-to-r inline-block content-center from-golden-glow via-pink-shade to-golden-glow-dark px-3 text-sm font-medium py-1">
            {badge}
          </p>
          <p className="text-gray-700 text-base leading-relaxed">{description}</p>

          <div className="flex items-center gap-2 text-gray-600 text-base">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        </div>

        {/* Right image */}
        <div className="max-w-[440px] self-center relative h-[400px] md:h-[500px] w-full">
          {image && image !== '' ? (
            <Image
              src={image}
              alt="Section image"
              fill
              sizes="(max-width: 768px) 100vw, 440px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>
      </div>

      <SectionDivider classNames="max-w-[45rem] mt-4 md:mt-0" />
    </section>
  );
};

export default ProductHighlightSection;
