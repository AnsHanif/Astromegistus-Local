'use client';

import React from 'react';
import { PaymentOption } from './order-summary.types';

interface PaymentOptionCardProps {
  option: PaymentOption;
  selected: boolean;
  onSelect: () => void;
  classNames?: string;
}

const PaymentOptionCard = ({
  option,
  selected,
  onSelect,
  classNames = '',
}: PaymentOptionCardProps) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 w-full cursor-pointer border bg-grey-light-50 flex items-center gap-3 transition-all
      ${selected ? 'border-bronze text-bronze' : 'border-[#D9D9D9] text-black'}
      ${classNames}`}
    >
      <p
        className={`transition-colors ${
          selected ? 'text-bronze' : 'text-black'
        }`}
      >
        {option.icon}
      </p>
      <h3 className="text-size-secondary font-medium md:text-size-large">
        {option.label}
      </h3>
    </div>
  );
};

export default PaymentOptionCard;
