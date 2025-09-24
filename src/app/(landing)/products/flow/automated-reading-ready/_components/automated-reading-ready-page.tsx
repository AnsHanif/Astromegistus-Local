'use client';

import React from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import SuccessAnimation from '@/components/common/success-animation';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const AutomatedReadingReadyPage = () => {
  return (
    <ProductInfoHeader title="Reading Ready">
      <div className="flex flex-col gap-4 max-w-[35rem] mx-auto items-center pb-40">
        <SuccessAnimation />

        <h2 className="text-size-heading md:text-size-primary font-bold">
          Your personalized reading is ready!
        </h2>
        <p className="text-sm font-medium">
          It has also been sent to your email.
        </p>

        <div className="flex gap-2 justify-between w-full mt-8">
          <Button
            className="bg-emerald-green hover:bg-emerald-green/95 max-w-[15rem] w-full border-emerald-green text-white"
            variant={'outline'}
          >
            <Eye />
            Get Reading
          </Button>
          <Button
            variant={'outline'}
            className="border-emerald-green hover:bg-grey-light-50 max-w-[15rem] w-full text-emerald-green"
          >
            Go To Dashboard
          </Button>
        </div>
      </div>
    </ProductInfoHeader>
  );
};

export default AutomatedReadingReadyPage;
