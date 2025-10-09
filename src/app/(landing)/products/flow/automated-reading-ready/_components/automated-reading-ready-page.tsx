'use client';

import React from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import SuccessAnimation from '@/components/common/success-animation';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';

const AutomatedReadingReadyPage = () => {
  return (
    <ProductInfoHeader title="Reading Ready">
      <div className="flex flex-col gap-4 max-w-[40rem] mx-auto items-center pb-40">
        <SuccessAnimation />

        <h2 className="text-size-heading text-center md:text-size-primary font-bold">
          Your personalized reading is ready and document is pending for your
          review!
        </h2>
        <p className="text-sm font-medium">
          It has also been sent to your email.
        </p>

        <div className="flex gap-2 justify-between w-full mt-8">
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 bg-emerald-green hover:bg-emerald-green/95 
               max-w-[15rem] w-full border border-emerald-green text-white px-4 py-2"
          >
            <Eye />
            Get Reading
          </Link>

          <Link
            href="/dashboard/booked-readings"
            className="flex items-center justify-center gap-2 border border-emerald-green 
               hover:bg-grey-light-50 max-w-[15rem] w-full text-emerald-green px-4 py-2"
          >
            Go To Dashboard
          </Link>
        </div>
      </div>
    </ProductInfoHeader>
  );
};

export default AutomatedReadingReadyPage;
