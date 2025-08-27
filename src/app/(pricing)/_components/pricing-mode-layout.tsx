'use client';

import React, { FC, ReactNode } from 'react';
import Image from 'next/image';
import { logo } from '@/components/assets';
import { useRouter } from 'next/navigation';

import PricingHeader from './pricing-header';

interface PricingModeLayoutProps {
  children: ReactNode;
}

const PricingModeLayout: FC<PricingModeLayoutProps> = ({ children }) => {
  const router = useRouter();
  return (
    <div>
      <PricingHeader />
      <div className="h-24 w-24 md:w-32 md:h-32 mx-auto mt-5 mb-11">
        <Image
          src={logo}
          alt="Astromegistus Logo"
          width={128}
          height={128}
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => router.push('/')}
        />
      </div>

      <div>{children}</div>
    </div>
  );
};

export default PricingModeLayout;
