'use client';

import React, { FC } from 'react';
import { CheckCircle, Info } from 'lucide-react';
import SectionDivider from './section-divider';

interface ProductOverviewProps {
  title?: string;
  description?: string;
  focusAreas?: string[];
  charts?: string[];
}

const ProductOverview: FC<ProductOverviewProps> = ({
  title = 'Overview',
  description = `The Soul-to-Current Moment reading offers a profound journey into your karmic past, fixed stars, and psychological cycles, revealing how they influence your present reality. This in-depth analysis provides clarity and guidance for navigating life's challenges and opportunities.`,
  focusAreas = [
    'Karmic Past & Soul Purpose',
    'Fixed Stars & Destiny Points',
    'Psychological & Emotional Cycles',
  ],
  charts = [
    'Draconic Chart',
    'Progressions',
    'Solar Arc Directions',
    'Midpoints',
  ],
}) => {
  return (
    <section className="w-full bg-white">
      <h2 className="text-size-heading md:text-size-primary font-bold mb-4">
        {title}
      </h2>
      <p className="text-sm mb-8">{description}</p>

      {/* Key Focus Areas */}
      <div className="mb-10">
        <h3 className="text-size-heading md:text-size-primary font-bold mb-4">
          Key Focus Areas
        </h3>
        <ul className="space-y-3">
          {focusAreas.map((area, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-base text-gray-800"
            >
              <CheckCircle className="text-green-500 w-5 h-5 mt-[2px]" />
              {area}
            </li>
          ))}
        </ul>
      </div>

      {/* Charts Used */}
      <div className='mb-8'>
        <h3 className="text-size-heading md:text-size-primary font-bold mb-4">
          Charts Used
        </h3>
        <ul className="space-y-3">
          {charts.map((chart, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-base text-gray-800"
            >
              <Info className="text-gray-500 w-5 h-5 mt-[2px]" />
              {chart}
            </li>
          ))}
        </ul>
      </div>

      <SectionDivider text="What's Included" classNames="max-w-[45rem]" />
    </section>
  );
};

export default ProductOverview;
