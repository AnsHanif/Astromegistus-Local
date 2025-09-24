'use client';

import { useState, memo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import {
  MONTH_OPTIONS,
  YEAR_OPTIONS,
} from '@/app/(auth)/signup/_components/signup.constant';

interface CardPaymentData {
  name: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
}

interface CardPaymentFormProps {
  onPay: (data: CardPaymentData) => void;
}

const CardPaymentForm = ({ onPay }: CardPaymentFormProps) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');

  return (
    <div className="flex flex-col gap-8">
      <div className="text-size-large font-medium md:text-size-heading">
        Payment Details
      </div>

      {/* Card Holder + Number */}
      <div className="flex flex-col md:flex-row gap-4 lg:gap-16 2xl:gap-32">
        <div className="flex flex-col w-full gap-3">
          <Label className="md:text-size-medium font-medium">
            Name on Card
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-[#093B1D] w-full px-5 focus:border-black focus:ring-0 focus:outline-none"
            placeholder="John Doe"
          />
        </div>

        <div className="flex flex-col w-full gap-3">
          <Label className="md:text-size-medium font-medium">Card Number</Label>
          <Input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="border-[#093B1D] focus:border-black focus:ring-0 focus:outline-none"
            placeholder="1111 2222 3333 4444"
          />
        </div>
      </div>

      {/* Expiry + CVC */}
      <div className="grid !grid-cols-1 xs:!grid-cols-3 gap-4 lg:gap-16 2xl:gap-32">
        <div className="flex flex-col gap-3 w-full">
          <Label className="md:text-size-medium font-medium">
            Expiry Month
          </Label>
          <CustomSelect
            onSelect={(val) => setExpiryMonth(val)}
            options={MONTH_OPTIONS}
            placeholder="MM"
            selectedValue={expiryMonth}
            className="w-full h-12 sm:h-15"
            triggerClassName="h-12 w-full sm:h-15 cursor-pointer focus:border-black hover:border-grey border-grey text-black"
            chevronClassName="text-black"
            contentClassName="w-full text-black max-h-60 overflow-y-auto"
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Label className="md:text-size-medium font-medium">Expiry Year</Label>
          <CustomSelect
            onSelect={(val) => setExpiryYear(val)}
            options={YEAR_OPTIONS}
            placeholder="YY"
            selectedValue={expiryYear}
            className="w-full h-12 sm:h-15"
            triggerClassName="h-12 w-full sm:h-15 cursor-pointer focus:border-black hover:border-grey border-grey text-black"
            chevronClassName="text-black"
            contentClassName="w-full text-black max-h-60 overflow-y-auto"
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Label className="md:text-size-medium font-medium">CVC</Label>
          <Input
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="border-[#093B1D] focus:border-black h-12 xs:h-full focus:ring-0 focus:outline-none"
            placeholder="123"
          />
        </div>
      </div>

      <hr className="my-3" />

      <div className="flex justify-between items-center md:text-size-large font-medium">
        <span>Total</span>
        <span>$198</span>
      </div>

      <Button
        variant={'outline'}
        className="w-full bg-emerald-green rounded-none h-12 md:h-15 text-white hover:bg-emerald-green/90"
        onClick={() => onPay({ name, number, expiryMonth, expiryYear, cvc })}
      >
        Confirm Booking
      </Button>
    </div>
  );
};

export default memo(CardPaymentForm);
