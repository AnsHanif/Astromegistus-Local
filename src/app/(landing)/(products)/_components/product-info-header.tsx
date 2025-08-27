// components/ProductInfoHeader.tsx
import React, { ReactNode } from 'react';

interface ProductInfoHeaderProps {
  title: string;
  classNames?: string;
  children: ReactNode;
}

export default function ProductInfoHeader({
  title,
  classNames = '',
  children,
}: ProductInfoHeaderProps) {
  return (
    <div className={`m-4 relative ${classNames}`}>
      {/* Header */}
      <div className="bg-emerald-green z-[0px] text-white py-6 md:py-8 h-[200px] text-center">
        <h1 className="text-size-heading md:text-size-primary font-bold">
          {title}
        </h1>
      </div>

      {/* Page Content */}
      <div
        style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}
        className="p-8 md:p-16 mt-[-7.5rem] md:mt-[-6rem] bg-white mx-6"
      >
        <div className="max-w-[1600px] mx-auto">{children}</div>
      </div>
    </div>
  );
}
