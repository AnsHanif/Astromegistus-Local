'use client';

import React, { useCallback, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tab';
import PaymentOptionCard from './payment-options';
import { CardPaymentData, PaymentOption } from './order-summary.types';
import CreditCardIcon from '@/components/assets/svg-icons/pricing/credit-card-icon';
import PaypalIcon from '@/components/assets/svg-icons/pricing/paypal-icon';
import CardPaymentForm from './card-payment-form';

const paymentOptions: PaymentOption[] = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: <CreditCardIcon className="w-5 h-5" />,
  },
  { id: 'paypal', label: 'PayPal', icon: <PaypalIcon className="w-5 h-5" /> },
];

const OrderSummaryPage = () => {
  const [selected, setSelected] = useState<string>('card');
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  const handlePay = useCallback((data: CardPaymentData) => {
    console.log('Payment data:', data);
    // 🔗 call your API here
  }, []);

  const triggerClass =
    'text-grey data-[state=active]:text-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-golden-glow data-[state=active]:via-pink-shade data-[state=active]:to-golden-glow-dark cursor-pointer p-2 font-medium';

  return (
    <div className="min-h-screen h-full flex flex-col items-center p-4">
      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-16 w-full max-w-5xl">
        {/* Order Summary */}
        <div className="md:max-w-[300px] w-full">
          <div className="space-y-2 mb-4">
            <h1 className="text-size-large md:text-size-heading font-semibold">
              Order Summary
            </h1>

            <p className="text-size-tertiary font-normal text-grey">
              Review your selected plan
            </p>
            <h2 className="text-size-large font-semibold">Classic Plan</h2>
          </div>
          <div className="space-y-4">
            {/* Billing Tabs */}
            <Tabs
              value={plan}
              onValueChange={(v) => setPlan(v as 'monthly' | 'annual')}
              className="w-full mb-6"
            >
              <TabsList
                className="grid grid-cols-2 w-full mx-auto max-w-[220px] rounded-none"
                style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25)' }}
              >
                <TabsTrigger value="annual" className={`${triggerClass}`}>
                  Annually
                </TabsTrigger>
                <TabsTrigger value="monthly" className={triggerClass}>
                  Monthly
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="text-sm space-y-4">
              <div className="flex justify-between font-medium">
                <p>Plan Price:</p>
                <p>{plan === 'annual' ? '$190 / Year' : '$19 / Month'}</p>
              </div>

              {plan === 'annual' && (
                <div className="flex font-medium justify-between text-[#459C1A]">
                  <p>Annual Savings:</p>
                  <p>-$38</p>
                </div>
              )}

              <hr className="my-4" />

              <div className="flex justify-between items-center text-size-secondary md:text-size-medium font-semibold">
                <p>Total: </p>
                <p>{plan === 'annual' ? '$190 / Year' : '$19 / Month'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="w-full">
          <h2 className="text-size-large md:text-size-heading font-semibold mb-2">
            Payment Methods
          </h2>
          <div className="space-y-4">
            {/* Payment Options */}
            <div className="flex flex-col gap-3 mb-8">
              {paymentOptions.map((option) => (
                <PaymentOptionCard
                  key={option.id}
                  option={option}
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
      </div>
    </div>
  );
};

export default OrderSummaryPage;
