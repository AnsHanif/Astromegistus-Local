'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tab';
import PaymentOptionCard from './payment-options';
import { PaymentOption } from './order-summary.types';
import CreditCardIcon from '@/components/assets/svg-icons/pricing/credit-card-icon';
import PaypalIcon from '@/components/assets/svg-icons/pricing/paypal-icon';
import CardPaymentForm from './card-payment-form';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { useGetPricingPlans } from '@/hooks/mutation/pricing-mutation/pricing';
import FullScreenLoader from '@/components/common/full-screen-loader';
import PaypalPaymentForm from './paypal-payment-form';

const triggerClass = `
  text-grey
  data-[state=active]:text-black
  data-[state=active]:bg-gradient-to-r
  data-[state=active]:from-golden-glow
  data-[state=active]:via-pink-shade
  data-[state=active]:to-golden-glow-dark
  cursor-pointer
  p-2
  font-medium
`;

const paymentOptions: PaymentOption[] = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: <CreditCardIcon className="w-5 h-5" />,
  },
  { id: 'paypal', label: 'PayPal', icon: <PaypalIcon className="w-5 h-5" /> },
];

const OrderSummaryPage = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan');
  const router = useRouter();

  const { data, error, isError, isPending } = useGetPricingPlans();

  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');
  const [selected, setSelected] = useState<string>('card');
  const [isLoading, setIsLoading] = useState(false);

  const { planName, annualPlan, monthlyPlan, savings } = useMemo(() => {
    const allPlans = data?.data?.foundPlans || [];

    const normalizedPlan =
      selectedPlan === 'PREMIER' || selectedPlan === 'CLASSIC'
        ? selectedPlan
        : 'CLASSIC';

    const annual = allPlans.find(
      (p: any) => p.type === 'ANNUALLY' && p.name === normalizedPlan
    );
    const monthly = allPlans.find(
      (p: any) => p.type === 'MONTHLY' && p.name === normalizedPlan
    );

    const savings = (monthly?.price ?? 0) * 12 - (annual?.price ?? 0);

    return {
      planName: normalizedPlan,
      monthlyPlan: monthly,
      annualPlan: annual,
      savings,
    };
  }, [data, selectedPlan]);

  useEffect(() => {
    const session = Cookies.get('temp-nutk-astro');
    if (!session) {
      router.replace('/signup');
      return;
    }

    if (isError) {
      const defaultMessage =
        'We couldn’t load the pricing plan. Please try again shortly.';
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        defaultMessage;

      closeSnackbar();
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [router, error, isError]);
  return (
    <div className="min-h-screen h-full flex flex-col items-center p-4">
      {isPending && <FullScreenLoader />}
      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-16 w-full max-w-5xl">
        <div className="md:max-w-[300px] w-full">
          <div className="space-y-2 mb-4">
            <h1 className="text-size-large md:text-size-heading font-semibold">
              Order Summary
            </h1>

            <p className="text-size-tertiary font-normal text-grey">
              Review your selected plan
            </p>
            <h2 className="text-size-large font-semibold">{planName} Plan</h2>
          </div>
          <div className="space-y-4">
            <Tabs
              value={plan}
              onValueChange={(v) => setPlan(v as 'monthly' | 'annual')}
              className="w-full mb-6"
            >
              <TabsList
                className="grid grid-cols-2 w-full mx-auto max-w-[220px] rounded-none"
                style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25)' }}
              >
                <TabsTrigger
                  value="annual"
                  className={`${triggerClass}`}
                  disabled={isLoading}
                >
                  Annually
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className={triggerClass}
                  disabled={isLoading}
                >
                  Monthly
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="text-sm space-y-4">
              <div className="flex justify-between font-medium">
                <p>Plan Price:</p>
                <p>
                  {plan === 'annual'
                    ? `$${monthlyPlan?.price * 12} / Year`
                    : `$${monthlyPlan?.price} / Month`}
                </p>
              </div>

              {plan === 'annual' &&
                monthlyPlan &&
                annualPlan &&
                savings > 0 && (
                  <div className="flex font-medium justify-between text-[#459C1A]">
                    <p>Annual Savings:</p>
                    <p>-${savings.toFixed(2)}</p>
                  </div>
                )}

              <hr className="my-4" />

              <div className="flex justify-between items-center text-size-secondary md:text-size-medium font-semibold">
                <p>Total: </p>
                <p>
                  {plan === 'annual'
                    ? `$${annualPlan?.price} / Year`
                    : `$${monthlyPlan?.price} / Month`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-size-large md:text-size-heading font-semibold mb-2">
            Payment Methods
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 mb-8">
              {paymentOptions.map((option) => (
                <PaymentOptionCard
                  key={option.id}
                  option={option}
                  selected={selected === option.id}
                  onSelect={() => setSelected(option.id)}
                  disabled={isLoading}
                />
              ))}
            </div>

            <hr />

            {selected === 'card' && (
              <CardPaymentForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                selectPlan={plan === 'annual' ? annualPlan : monthlyPlan}
              />
            )}

            {selected === 'paypal' && (
              <PaypalPaymentForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                selectPlan={plan === 'annual' ? annualPlan : monthlyPlan}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
