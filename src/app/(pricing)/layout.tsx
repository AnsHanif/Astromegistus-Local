import React, { FC, ReactNode } from 'react';
import PricingModeLayout from './_components/pricing-mode-layout';
import Footer from '@/components/common/footer';

interface PricingLayoutProps {
  children: ReactNode;
}

const PricingLayout: FC<PricingLayoutProps> = ({ children }) => {
  return (
    <div className="">
      <main>
        <PricingModeLayout>{children}</PricingModeLayout>
        <Footer />
      </main>
    </div>
  );
};

export default PricingLayout;
