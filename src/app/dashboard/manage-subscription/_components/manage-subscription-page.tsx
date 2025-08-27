'use client';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PricingImg, Box, Crown, Star } from '@/components/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

type Plan = {
  id: string;
  title: string;
  priceLabel: string;
  priceSuffix?: string;
  image: any;
  badge?: string;
  features: string[];
  buttonText: string;
  buttonStyle?: string;
  borderColor: string;
};

const plans: Plan[] = [
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
    buttonText: 'Buy Now',
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
    buttonText: 'Buy Now',
    borderColor: '#0D853D',
  },
];

export default function ManageSubscriptionPage() {
  const [showPlan, setShowPlan] = useState(false);
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
            className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 cursor-pointer border border-white transition-all duration-200 hover:bg-white/10 hover:shadow-md"
            onClick={() => setShowPlan(true)}
          >
            <h1 className="text-size-large md:text-size-heading font-semibold">
              Change Plan
            </h1>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 group-hover:translate-x-1" />
          </div>

          <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 cursor-pointer border border-white transition-all duration-200 hover:bg-white/10 hover:shadow-md">
            <h1 className="text-size-large md:text-size-heading font-semibold">
              Cancel Subscription
            </h1>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 text-black my-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative bg-white shadow-md flex flex-col border-t-10 border-b-10"
              style={{ borderColor: plan.borderColor }}
            >
              <div className="absolute top-3 right-0 z-20">
                <div
                  className="relative bg-golden-glow-dark text-white text-xs font-normal px-3 py-2 shadow-lg 
    before:content-[''] before:absolute before:top-1/2 before:-left-3 before:-translate-y-1/2 
    before:border-y-[16px] before:border-y-transparent before:border-r-[12px] before:border-r-golden-glow-dark"
                >
                  {plan.badge}
                </div>
              </div>

              <div className="px-8 pt-10 flex-0">
                <div className="flex justify-center">
                  <img
                    src={plan.image.src}
                    alt="Loading Image"
                    className="w-32 h-32 object-contain"
                  />
                </div>

                <h1 className="text-size-heading md:text-size-primary font-bold text-center mt-6">
                  {plan.title}
                </h1>

                <div className="text-center mt-4">
                  <span className="text-size-heading md:text-size-primary font-bold">
                    {plan.priceLabel}
                  </span>
                  {plan.priceSuffix && (
                    <span className="text-base font-normal">
                      {plan.priceSuffix}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-8 mt-6 flex-1">
                <ul className="space-y-4 text-left text-base">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-8 pb-4 pt-8">
                <Button
                  variant="default"
                  className={`w-full ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
