'use client';

import React, { useCallback, useState } from 'react';
import {
  CardPaymentData,
  PaymentOption,
} from '@/app/(pricing)/order-summary/_components/order-summary.types';
import CreditCardIcon from '@/components/assets/svg-icons/pricing/credit-card-icon';
import PaypalIcon from '@/components/assets/svg-icons/pricing/paypal-icon';
import PaymentOptionCard from '@/app/(pricing)/order-summary/_components/payment-options';
import ProductInfoHeader from '../../_components/product-info-header';
import CardPaymentForm from './card-payment-form';

const paymentOptions: PaymentOption[] = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: <CreditCardIcon className="w-5 h-5" />,
  },
  { id: 'paypal', label: 'PayPal', icon: <PaypalIcon className="w-5 h-5" /> },
];

const PaymentInfoPage = () => {
  const [selected, setSelected] = useState<string>('card');

  const handlePay = useCallback((data: CardPaymentData) => {
    console.log('Payment Info data:', data);
  }, []);

  return (
    <ProductInfoHeader title="Secure Checkout">
      {/* Payment Section */}
      <div className="w-full">
        <h2 className="text-size-large md:text-size-heading font-semibold mb-2">
          Payment Methods
        </h2>

        <div className="space-y-4">
          {/* Payment Options */}
          <div className="flex flex-col gap-3 mb-6 md:mb-10">
            {paymentOptions.map((option) => (
              <PaymentOptionCard
                key={option.id}
                option={option}
                classNames="md:p-6"
                selected={selected === option.id}
                onSelect={() => setSelected(option.id)}
              />
            ))}
          </div>

          <hr />

          {/* Card Details */}
          <CardPaymentForm onPay={handlePay} />
        </div>
      </div>
    </ProductInfoHeader>
  );
};

export default PaymentInfoPage;
