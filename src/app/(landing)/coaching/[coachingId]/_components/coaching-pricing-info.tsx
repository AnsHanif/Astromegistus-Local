'use client';

import React, { FC, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import ArrowBackIcon from '@/components/assets/svg-icons/arrow-back-icon';
import { useRouter } from 'next/navigation';
import { CoachingSession } from '@/types/coaching';

interface CoachingPricingInfoProps {
  onClick: (selectedPackage: any) => void;
  session: CoachingSession;
}

const CoachingPricingInfo: FC<CoachingPricingInfoProps> = ({ onClick, session }) => {
  const router = useRouter();

  // Use dynamic packages from session data
  const dynamicPackages = session.packages?.map((pkg, index) => ({
    id: `package-${index}`,
    label: pkg.name,
    price: `$${pkg.price}`,
    originalPrice: pkg.price,
    duration: pkg.duration,
    description: pkg.description
  })) || [];

  const [selectedPackage, setSelectedPackage] = useState(dynamicPackages[0]?.id || '');

  const navigateToCoachingOverview = () => {
    router.push('/coaching');
  };

  if (dynamicPackages.length === 0) {
    return (
      <div>
        <h3 className="text-xl md:text-2xl font-bold mb-16">
          Coaching Pricing Info
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No packages available for this coaching session.</p>
          <Button
            onClick={navigateToCoachingOverview}
            variant="outline"
            className="border border-bronze h-12 md:h-15 w-full max-w-[340px] text-bronze rounded-none hover:bg-bronze/90 hover:text-white"
          >
            <ArrowBackIcon />
            Back to Coaching Overview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h3 className="text-xl md:text-2xl font-bold mb-16">
        Coaching Pricing Info
      </h3>

      {/* Package Options */}
      <RadioGroup
        value={selectedPackage}
        onValueChange={setSelectedPackage}
        className="w-[87%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 justify-items-center"
      >
        {dynamicPackages.map((pkg) => (
          <label key={pkg.id} className="cursor-pointer">
            <div className="bg-[#F7F7F7] p-8 relative w-64 h-[242px]">
              <div className="absolute top-4 left-4">
                <RadioGroupItem value={pkg.id} />
              </div>

              {/* Content - Centered */}
              <div className="text-center pt-4">
                {/* Package Label */}
                <h4 className="text-lg font-medium mb-8 text-gray-900">
                  {pkg.label}
                </h4>

                {/* Price */}
                <div className="text-4xl font-bold text-gray-900">
                  {pkg.price}
                </div>
              </div>
            </div>
          </label>
        ))}
      </RadioGroup>

      {/* Main Session Price Display - Same styling as product pricing */}
      <div className="text-base mb-8 space-y-3">
        {session.price && session.price > 0 ? (
          <div>
            Coaching Session Price:{' '}
            <span className="text-bronze text-lg font-semibold">
              ${session.price}
            </span>
          </div>
        ) : (
          <div className="text-white/60 text-sm">Price not available</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 items-start max-w-[280px] md:max-w-[340px]">
        {/* Back Button - outlined style */}
        <Button
          onClick={navigateToCoachingOverview}
          variant="outline"
          className="border border-bronze h-12 md:h-15 w-full text-bronze rounded-none hover:bg-bronze/90 hover:text-white"
        >
          <ArrowBackIcon />
          Back to Coaching Overview
        </Button>

        {/* Book Session Button - filled style */}
        <Button
          onClick={() => {
            const selected = dynamicPackages.find(pkg => pkg.id === selectedPackage);
            if (selected) {
              // Comment out: Package price logic - now using main session price
              // onClick(selected); // This would use selectedPackage.originalPrice
              onClick(selected); // Still pass selected package but cart uses session.price
            }
          }}
          className="bg-bronze w-full hover:bg-bronze/90 font-medium text-white px-6 py-3 text-base"
        >
          Book Coaching Session
        </Button>
      </div>
    </div>
  );
};

export default CoachingPricingInfo;
