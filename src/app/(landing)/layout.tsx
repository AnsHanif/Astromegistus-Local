import React from 'react';
import type { ReactNode } from 'react';
import LandingHeader from './_components/landing-header';
import Footer from '@/components/common/footer';

export default function layout({ children }: { children: ReactNode }) {
  return (
    <main>
      <LandingHeader />
      {children}
      <Footer />
    </main>
  );
}
