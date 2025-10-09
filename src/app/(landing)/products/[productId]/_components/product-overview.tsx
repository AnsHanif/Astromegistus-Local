'use client';

import React, { FC } from 'react';
import { CheckCircle, Info } from 'lucide-react';
import SectionDivider from './section-divider';

interface ProductSection {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  order: number;
}

interface ProductOverviewProps {
  title?: string;
  description?: string;
  focusAreas?: ProductSection[];
  charts?: ProductSection[];
}

const ProductOverview: FC<ProductOverviewProps> = ({
  title = 'Overview',
  description = `The Soul-to-Current Moment reading offers a profound journey into your karmic past, fixed stars, and psychological cycles, revealing how they influence your present reality. This in-depth analysis provides clarity and guidance for navigating life's challenges and opportunities.`,
  focusAreas,
  charts,
}) => {
  return (
    <section className="w-full bg-white">
      {/* Key Focus Areas */}
      <div className="mb-10">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Key Focus Areas
        </h3>
        {!focusAreas || focusAreas.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No focus areas available
          </div>
        ) : (
          <ul className="space-y-3">
            {focusAreas.map((area, index) => (
              <li
                key={area.id || index}
                className="flex items-start gap-2 text-base text-gray-800"
              >
                <CheckCircle className="text-green-500 w-5 h-5 mt-[2px]" />
                <div>
                  <div className="text-base font-bold">{area.title}</div>
                  {area.description && (
                    <div className="text-base text-gray-600 mt-1">{area.description}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Charts Used */}
      <div className='mb-8'>
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Charts Used
        </h3>
        {!charts || charts.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No charts available
          </div>
        ) : (
          <ul className="space-y-3">
            {charts.map((chart, index) => (
              <li
                key={chart.id || index}
                className="flex items-start gap-2 text-base text-gray-800"
              >
                <Info className="text-gray-500 w-5 h-5 mt-[2px]" />
                <div>
                  <div className="text-base font-bold">{chart.name || chart.title}</div>
                  {chart.description && (
                    <div className="text-base text-gray-600 mt-1">{chart.description}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SectionDivider text="What's Included" classNames="max-w-[45rem]" />
    </section>
  );
};

export default ProductOverview;
