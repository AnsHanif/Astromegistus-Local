'use client';

import React, { FC, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import ArrowBackIcon from '@/components/assets/svg-icons/arrow-back-icon';
import { useRouter } from 'next/navigation';

interface CoachingPricingInfoProps {
  onClick: () => void;
}

const CoachingPricingInfo: FC<CoachingPricingInfoProps> = ({ onClick }) => {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState('1-hour');

  const packages = [
    { id: '1-hour', label: '1 Hour Package', price: '$120' },
    { id: '5-hour', label: '5 Hour Package', price: '$120' },
    { id: '10-hour', label: '10 Hour Package', price: '$120' },
  ];
  

  const navigateToCoachingOverview = () => {
    router.push('/coaching');
  };

  return (
    <div>
      {/* Heading */}
      <h3 className="text-2xl md:text-3xl font-bold mb-16">
        Coaching Pricing Info
      </h3>

      {/* Package Options */}
      <RadioGroup
        value={selectedPackage}
        onValueChange={setSelectedPackage}
        className="w-[87%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 justify-items-center"
      >
        {packages.map((pkg) => (
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

      {/* Actions */}
      <div className="flex flex-col gap-4 items-start max-w-[340px]">
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
          onClick={onClick}
          className="bg-bronze w-full hover:bg-bronze/90 font-medium text-white px-6 py-3 text-base"
        >
          Book Coaching Session
        </Button>
      </div>
    </div>
  );
};

export default CoachingPricingInfo;
