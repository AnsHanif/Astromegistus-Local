import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface FeatureDetailCardProps {
  classNames?: string;
}

const FeatureDetailCard: FC<FeatureDetailCardProps> = ({ classNames }) => {
  return (
    <div className={`flex flex-col bg-grey-light-50 p-4 ${classNames}`}>
      {/* Tag */}
      <p className="self-end bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark px-3 py-1.5 text-xs font-semibold mb-4">
        Core / Integrative
      </p>

      {/* Description */}
      <p className="text-justify text-base mb-4">
        Full karmic-to-present arc incl. draconic, evolutionary, traditional +
        psychological charts, predictive cycles, fixed stars + 2 automated
        readings + 1 follow up live-session + 30 min coaching
      </p>

      {/* Duration */}
      <div className="flex itme gap-2 text-base mb-6">
        <Clock className="w-5 h-5" />
        <p className='mt-0.5'>120 min + 60 min prep</p>
      </div>

      {/* Button at bottom */}
      <Button className="bg-emerald-green text-white max-w-[300px] w-full m-auto mb-0">
        View Details
      </Button>
    </div>
  );
};

export default FeatureDetailCard;
