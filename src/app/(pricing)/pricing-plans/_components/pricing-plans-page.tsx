'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { PricingImg, Box, Crown, Star } from '@/components/assets';
import { Button } from '@/components/ui/button';
import Link from '@/components/common/custom-link/custom-link';
import SupremeInquireModal from './supreme-inquire-modal';

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
  {
    id: 'supreme',
    title: 'Supreme',
    priceLabel: 'Inquire',
    image: Star,
    badge: 'Not Available Until January 1st',
    features: [
      '25% off additional automated readings',
      '10 live 1:1 coaching calls/year',
      'Priority access to all services',
      'Exclusive workshops & retreats',
      'All Premier benefits',
      'White-glove concierge support',
    ],
    buttonText: 'Inquire Now',
    buttonStyle:
      'bg-gradient-to-r from-[#BEB7FB] via-[#DFC5F6] to-[#B0D6F8] hover:from-[#BEB7FB]/92 hover:via-[#DFC5F6]/92 hover:to-[#B0D6F8]/92',
    borderColor: '#DAB612',
  },
];

export default function PricingPlansPage() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <div
        className="h-[394px] bg-cover bg-center text-white text-center px-4 sm:px-8"
        style={{ backgroundImage: `url(${PricingImg.src})` }}
      >
        <h1 className="text-size-heading md:text-size-primary font-bold pt-8">
          Choose Your Cosmic Membership
        </h1>
        <p className="pt-4">
          Unlock exclusive benefits, priority access, and special discounts on
          all astrology readings and coaching sessions
        </p>
      </div>

      <div className="px-4 sm:px-8">
        <div className="max-w-7xl mx-auto -mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 pb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative bg-white shadow-md flex flex-col border-t-10 border-b-10"
              style={{ borderColor: plan.borderColor }}
            >
              {plan.id === 'supreme' ? (
                <div className="absolute top-2 right-4 z-20">
                  <div className="text-golden-glow-dark text-sm font-medium py-1">
                    {plan.badge}
                  </div>
                </div>
              ) : (
                <div className="absolute top-3 right-0 z-20">
                  <div
                    className="relative bg-golden-glow-dark text-white text-xs font-normal px-3 py-2 shadow-lg 
    before:content-[''] before:absolute before:top-1/2 before:-left-3 before:-translate-y-1/2 
    before:border-y-[16px] before:border-y-transparent before:border-r-[12px] before:border-r-golden-glow-dark"
                  >
                    {plan.badge}
                  </div>
                </div>
              )}

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
                  {plan.id === 'supreme' ? (
                    <>
                      <li className="font-medium">Business & Organizations:</li>
                      {plan.features.slice(0, 3).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                          />
                          <span>{f}</span>
                        </li>
                      ))}

                      <li className="font-medium">Exclusive:</li>
                      {plan.features.slice(3).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </>
                  ) : (
                    plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                        />
                        <span>{f}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="px-8 pb-4 pt-8">
                <Button
                  variant="default"
                  className={`w-full ${plan.buttonStyle}`}
                  onClick={() => {
                    if (plan.id === 'supreme') {
                      setOpenModal(true);
                    } else {
                      console.log(`User clicked Buy Now for ${plan.title}`);
                    }
                  }}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="pb-4 text-center font-medium">
          *You can cancel your subscription monthly and pay in monthly
          increments. <br /> Please understand that financial discounts are only
          available on an annual subscription basis.
        </p>

        <p className="pb-4 text-center font-medium">
          Existing Member?{' '}
          <Link href="/login" className="text-golden-glow-dark hover:underline">
            Log In
          </Link>
        </p>
      </div>

      <SupremeInquireModal open={openModal} setOpen={setOpenModal} />
    </div>
  );
}
