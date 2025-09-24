'use client';

import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import ArrowBackIcon from '@/components/assets/svg-icons/arrow-back-icon';

interface ProductPricingInfoProps {
  onClick: () => void;
  sessionPrice?: string;
}

const ProductPricingInfo: FC<ProductPricingInfoProps> = ({
  onClick,
  sessionPrice,
}) => {
  return (
    <div>
      {/* Heading */}
      <h3 className="text-size-heading md:text-text-primary font-bold mb-12">
        Product Pricing Info
      </h3>

      {/* Price */}
      <div className="md:text-size-medium mb-8">
        Live Session:{' '}
        <span className="text-bronze text-sm">${sessionPrice}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 items-start max-w-[280px] md:max-w-[340px]">
        {/* Back Button - outlined style */}
        <Button
          variant="outline"
          className="border border-bronze h-12 md:h-15 w-full text-bronze rounded-none hover:bg-bronze/90"
        >
          <ArrowBackIcon />
          Back to Product Overview
        </Button>

        {/* Book Session Button - filled style */}
        <Button
          onClick={onClick}
          className="bg-bronze w-full hover:bg-bronze/90 font-medium text-white px-6 py-3 text-base"
        >
          Book Live Session
        </Button>
      </div>
    </div>
  );
};

export default ProductPricingInfo;
