'use client';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Box, Crown } from '@/components/assets';
import PricingPlanCard from '../../_components/pricing-plan-card';
import ConfirmationModal from '../../_components/confirmation-modal';

const plans = [
  {
    id: 'classic',
    title: 'Classic',
    priceLabel: '$190/',
    priceSuffix: 'yearly',
    image: Box,
    badge: 'Save $38',
    features: [
      '15% off all automated chart readings',
      '10% off live astrologer readings',
      '10% off personal coaching sessions',
      'Access to astrology news & insights',
      'Basic customer support',
    ],
    buttonText: 'Current Plan',
    buttonStyle: 'bg-emerald-green text-white',
    borderColor: '#000000',
  },
  {
    id: 'premier',
    title: 'Premier',
    priceLabel: '$390/',
    priceSuffix: 'yearly',
    image: Crown,
    badge: 'Save $78 Annually',
    features: [
      '20% off all automated readings',
      '3 free automated readings/year ($90-150 value)',
      '2 free 30-min live coaching sessions/year',
      'Priority booking for live readings & coaching',
      'All Classic benefits',
      'Premium customer support',
    ],
    buttonText: 'Upgrade Now',
    borderColor: '#0D853D',
  },
];

export default function ManageSubscriptionPage() {
  const [showPlan, setShowPlan] = useState(false);
  const [isModal, setIsModal] = useState(false);
  return (
    <>
      {!showPlan ? (
        <div className="space-y-8">
          <h1 className="text-size-medium md:text-size-large font-semibold">
            Current Subscription Details
          </h1>

          <div className="flex items-center justify-between px-4 py-6 md:px-8 md:py-8 border border-golden-glow">
            <h1 className="text-size-heading md:text-size-primary font-bold bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark bg-clip-text text-transparent">
              Classic Subscription
            </h1>
            <div className="text-right">
              <p className="text-size-tertiary font-normal mb-1">
                Subscription renews on
              </p>
              <p className="font-bold text-size-medium">Sep 27, 2025</p>
            </div>
          </div>

          <div
            className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 cursor-pointer border transition-all duration-200 hover:bg-white/10 hover:shadow-md"
            onClick={() => setShowPlan(true)}
          >
            <h1 className="text-size-large md:text-size-heading font-semibold">
              Change Plan
            </h1>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 group-hover:translate-x-1" />
          </div>

          <div
            className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 cursor-pointer border transition-all duration-200 hover:bg-white/10 hover:shadow-md"
            onClick={() => setIsModal(true)}
          >
            <h1 className="text-size-large md:text-size-heading font-semibold">
              Cancel Subscription
            </h1>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 group-hover:translate-x-1" />
          </div>

          <ConfirmationModal
            open={isModal}
            setOpen={setIsModal}
            title="Cancel Subscription"
            subTitle="Classic Plan – $19/month"
            description="You’ll lose access to classic features immediately after cancellation."
            btn1Title="Yes, Cancel"
            btn2Title="Keep Subscription"
            iconType="cancelSub"
          />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-center gap-8 z-10 my-10 text-black">
          {plans.map((plan) => (
            <PricingPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </>
  );
}
