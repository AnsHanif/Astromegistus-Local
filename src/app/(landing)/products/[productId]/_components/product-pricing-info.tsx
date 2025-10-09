'use client';

import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import ArrowBackIcon from '@/components/assets/svg-icons/arrow-back-icon';
import { useRouter } from 'next/navigation';

interface ProductPricingInfoProps {
  onClick: () => void;
  automatedPrice?: number;
  livePrice?: number;
  productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH';
}

const ProductPricingInfo: FC<ProductPricingInfoProps> = ({
  onClick,
  automatedPrice,
  livePrice,
  productType = 'BOTH',
}) => {
  const router = useRouter();
  return (
    <div>
      {/* Heading */}
      <h3 className="text-xl md:text-2xl font-bold mb-12">
        Product Pricing Info
      </h3>

      {/* Price */}
      <div className="text-base mb-8 space-y-3">
        {Number(automatedPrice) > 0 && (
          <div>
            Automated Reading:{' '}
            <span className="text-bronze text-lg font-semibold">
              ${automatedPrice}
            </span>
          </div>
        )}
        {(productType === 'LIVE_SESSIONS' || productType === 'BOTH') &&
          Number(livePrice) > 0 && (
            <div>
              Live Session:{' '}
              <span className="text-bronze text-lg font-semibold">
                ${livePrice}
              </span>
            </div>
          )}
        {/* {(!automatedPrice || automatedPrice === 0) && (!livePrice || livePrice === 0) && (
          <div className="text-white/60 text-sm">Price not available</div>
        )} */}
        {(!livePrice || livePrice === 0) && (
          <div className="text-white/60 text-sm">Price not available</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 items-start max-w-[280px] md:max-w-[340px]">
        {/* Back Button - outlined style */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="border border-bronze h-12 md:h-15 w-full text-bronze rounded-none hover:bg-bronze/90 hover:text-white"
        >
          <ArrowBackIcon />
          Back to Product Overview
        </Button>

        {/* Book Session Button - filled style */}
        <Button
          onClick={onClick}
          className="bg-bronze w-full hover:bg-bronze/90 font-medium text-white px-6 py-3 text-base"
        >
          {productType === 'READING'
            ? 'Book Reading'
            : productType === 'LIVE_SESSIONS'
              ? 'Book Live Session'
              : 'Book Session'}
        </Button>
      </div>
    </div>
  );
};

export default ProductPricingInfo;
