import React, { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface Plan {
  id: string;
  title: string;
  priceLabel: string;
  priceSuffix: string;
  image: any;
  badge: string;
  features: string[];
  buttonText: string;
  buttonStyle?: string;
  borderColor: string;
}

interface PricingPlanCardProps {
  plan: Plan;
}

export default function PricingPlanCard({
  plan,
}: PricingPlanCardProps): JSX.Element {
  return (
    <div
      key={plan.id}
      className="relative max-w-96 bg-white shadow-md flex flex-col border-t-10 border-b-10"
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
          <span className="text-base font-normal">{plan.priceSuffix}</span>
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
        <Button variant="default" className={`w-full ${plan.buttonStyle}`}>
          {plan.buttonText}
        </Button>
      </div>
    </div>
  );
}
