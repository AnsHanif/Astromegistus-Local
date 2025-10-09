'use client';

import { FC } from 'react';
import { Star } from 'lucide-react'; // you can swap with your custom icon
import FeatureIcon from '@/components/assets/svg-icons/feature-icon';

interface KeyFeaturesCardProps {
  title?: string;
  features: string[];
  classNames?: string;
}

const KeyFeaturesCard: FC<KeyFeaturesCardProps> = ({
  title = 'Key Features',
  features,
  classNames = '',
}) => {
  return (
    <div className={`bg-grey-light-50 ${classNames}`}>
      <h2 className="text-2xl md:text-3xl text-left font-semibold mb-4">
        {title}
      </h2>
      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center justify-start gap-2">
            <FeatureIcon className="text-bronze shrink-0" />
            <span className="text-base">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyFeaturesCard;
