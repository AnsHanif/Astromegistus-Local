'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { PricingImg, Box, Crown, Star } from '@/components/assets';
import { Button } from '@/components/ui/button';
import Link from '@/components/common/custom-link/custom-link';
import SupremeInquireModal from './supreme-inquire-modal';
import { useGetPricingPlans } from '@/hooks/mutation/pricing-mutation/pricing';
import { useSnackbar } from 'notistack';
import FullScreenLoader from '@/components/common/full-screen-loader';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function PricingPlansPage() {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { data, error, isError, isPending } = useGetPricingPlans();

  const [openModal, setOpenModal] = useState(false);

  const yearlyPlans = data?.data?.foundPlans || [];

  useEffect(() => {
    const session = Cookies.get('temp-nutk-astro');
    if (!session) router.replace('/signup');
  }, [router]);

  useEffect(() => {
    if (isError) {
      const defaultMessage =
        'We couldn’t load the pricing plans. Please try again shortly.';
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        defaultMessage;

      closeSnackbar();
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [error, isError]);
  return (
    <>
      {isPending && <FullScreenLoader />}
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
            {yearlyPlans
              .filter((plan: any) => plan.type === 'ANNUALLY')
              .map((plan: any) => {
                const monthlyPlan = data?.data?.foundPlans?.find(
                  (p: any) => p.type === 'MONTHLY' && p.name === plan.name
                );

                const savings = Number(monthlyPlan?.price * 12 - plan.price);
                return (
                  <div
                    key={plan.id}
                    className="relative bg-white shadow-md flex flex-col border-t-10 border-b-10"
                    style={{
                      borderColor: plan.name === 'PREMIER' ? '#0D853D' : '#000',
                    }}
                  >
                    {savings > 0 && (
                      <div className="absolute top-3 right-0 z-20">
                        <div
                          className="relative bg-golden-glow-dark text-white text-xs font-normal px-3 py-2 shadow-lg 
    before:content-[''] before:absolute before:top-1/2 before:-left-3 before:-translate-y-1/2 
    before:border-y-[16px] before:border-y-transparent before:border-r-[12px] before:border-r-golden-glow-dark"
                        >
                          Save ${savings.toFixed(2)} Annually
                        </div>
                      </div>
                    )}

                    <div className="px-8 pt-10 flex-0">
                      <div className="flex justify-center">
                        <img
                          src={plan.name === 'PREMIER' ? Crown.src : Box.src}
                          alt="Loading Image"
                          className="w-32 h-32 object-contain"
                        />
                      </div>

                      <h1 className="text-size-heading md:text-size-primary font-bold text-center mt-6">
                        {plan.name}
                      </h1>

                      <div className="text-center mt-4">
                        <span className="text-size-heading md:text-size-primary font-bold">
                          ${plan.price}/
                        </span>
                        <span className="text-base font-normal">yearly</span>
                      </div>
                    </div>

                    <div className="px-8 mt-6 flex-1">
                      <ul className="space-y-4 text-left text-base">
                        {plan.features.map((f: string, idx: number) => (
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
                        className={`w-full ${
                          plan.name === 'CLASSIC' &&
                          'bg-emerald-green text-white'
                        }`}
                        onClick={() =>
                          router.push(`/order-summary?plan=${plan.name}`)
                        }
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                );
              })}

            <div className="relative bg-white shadow-md flex flex-col border-t-10 border-b-10 border-[#DAB612]">
              <div className="absolute top-2 right-4 z-20">
                <div className="text-golden-glow-dark text-sm font-medium py-1">
                  Not Available Until January 1st
                </div>
              </div>

              <div className="px-8 pt-10 flex-0">
                <div className="flex justify-center">
                  <img
                    src={Star.src}
                    alt="Loading Image"
                    className="w-32 h-32 object-contain"
                  />
                </div>

                <h1 className="text-size-heading md:text-size-primary font-bold text-center mt-6">
                  SUPREME
                </h1>

                <div className="text-center mt-4">
                  <span className="text-size-heading md:text-size-primary font-bold">
                    INQUIRE
                  </span>
                </div>
              </div>

              <div className="px-8 mt-6 flex-1">
                <ul className="space-y-4 text-left text-base">
                  <li className="font-medium">Business & Organizations:</li>
                  {[
                    '25% off additional automated readings',
                    '10 live 1:1 coaching calls/year',
                    'Priority access to all services',
                  ].map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                      />
                      <span>{f}</span>
                    </li>
                  ))}

                  <li className="font-medium">Exclusive:</li>
                  {[
                    'Exclusive workshops & retreats',
                    'All Premier benefits',
                    'White-glove concierge support',
                  ].map((f, idx) => (
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
                  className={`w-full bg-gradient-to-r from-[#BEB7FB] via-[#DFC5F6] to-[#B0D6F8] hover:from-[#BEB7FB]/92 hover:via-[#DFC5F6]/92 hover:to-[#B0D6F8]/92`}
                  onClick={() => setOpenModal(true)}
                >
                  Inquire Now
                </Button>
              </div>
            </div>
          </div>

          <p className="pb-4 text-center font-medium">
            *You can cancel your subscription monthly and pay in monthly
            increments. <br /> Please understand that financial discounts are
            only available on an annual subscription basis.
          </p>

          <p className="pb-4 text-center font-medium">
            Existing Member?{' '}
            <Link
              href="/login"
              className="text-golden-glow-dark hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>

        <SupremeInquireModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        />
      </div>
    </>
  );
}
