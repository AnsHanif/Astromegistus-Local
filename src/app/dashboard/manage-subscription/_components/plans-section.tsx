'use client';
import React, { useEffect, useState } from 'react';
import { Box, Crown } from '@/components/assets';
import PricingPlanCard from '../../_components/pricing-plan-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useGetPricingPlans } from '@/hooks/mutation/pricing-mutation/pricing';
import { useSnackbar } from 'notistack';
import { getErrorMessage } from '@/utils/error-handler';
import FullScreenLoader from '@/components/common/full-screen-loader';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useStripeChangePlan } from '@/hooks/mutation/profile-mutation/profile';
import { useQueryClient } from '@tanstack/react-query';

export default function PlansSection({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const userInfo = useSelector((state: RootState) => state.user.currentUser);

  const { data, error, isError, isPending } = useGetPricingPlans();
  const { mutate, isPending: isLoading } = useStripeChangePlan();

  const [planType, setPlanType] = useState<'MONTHLY' | 'ANNUALLY'>('MONTHLY');

  const plans = data?.data?.foundPlans || [];
  const filteredPlans = plans.filter((p: any) => p.type === planType);

  const role = userInfo?.role;
  const subscriptions = userInfo?.subscriptions || [];
  const hasActiveSub = subscriptions.length > 0 && subscriptions[0]?.status;
  const currentPlanId = subscriptions[0]?.plan?.id;

  const getButtonConfig = (planId: string) => {
    if (role === 'GUEST') return { text: 'Subscribe Now', disabled: false };

    if (role === 'PAID') {
      if (!hasActiveSub) return { text: 'Subscribe Now', disabled: false };
      if (planId === currentPlanId) {
        return { text: 'Current Plan', disabled: true };
      }

      const currentPlan = plans.find((p: any) => p.id === currentPlanId);
      const targetPlan = plans.find((p: any) => p.id === planId);

      if (currentPlan && targetPlan) {
        if (targetPlan.price > currentPlan.price) {
          return { text: 'Upgrade', disabled: false };
        } else if (targetPlan.price < currentPlan.price) {
          return { text: 'Downgrade', disabled: false };
        }
      }

      return { text: 'Change Plan', disabled: false };
    }

    return { text: 'Not Available', disabled: true };
  };

  const handlePlanClick = (plan: any) => {
    if (role !== 'PAID' && role !== 'GUEST') return;

    if (role === 'GUEST') {
      const token = Cookies.get('astro-tk') || '';
      Cookies.set('temp-nutk-astro', token);
      router.push(`/order-summary?plan=${plan.name}`);
      return;
    }

    if (role === 'PAID') {
      if (plan.id === currentPlanId) return;

      if (!hasActiveSub || plan.id !== currentPlanId) {
        handlePlanChange(plan);
        return;
      }
    }
  };

  const handlePlanChange = (plan: any) => {
    if (userInfo?.defaultPaymentMethod === 'PAYPAL') {
      closeSnackbar();
      enqueueSnackbar(
        'For now PayPal services are not available. Please contact support.',
        {
          variant: 'error',
        }
      );
      return;
    }

    mutate(
      { planId: plan.id },
      {
        onSuccess: (response: any) => {
          closeSnackbar();
          enqueueSnackbar(response?.message, { variant: 'success' });

          localStorage.removeItem('cart');
          localStorage.removeItem('final-cart');
          queryClient.invalidateQueries({ queryKey: ['authUser'] });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        onError: (error: any) => {
          console.log(error);
          closeSnackbar();
          enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
        },
      }
    );
  };

  useEffect(() => {
    if (isError) {
      console.log(error);
      closeSnackbar();
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  }, [error, isError]);
  return (
    <div>
      {(isPending || isLoading) && <FullScreenLoader />}

      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center relative my-6">
        <div className="w-full md:w-auto md:absolute md:left-0 flex justify-center md:justify-start">
          <Button
            onClick={onBack}
            variant="default"
            className="h-11 md:h-11 flex items-center gap-2 font-normal bg-transparent border border-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft /> Back
          </Button>
        </div>

        {!isPending && plans.length !== 0 && (
          <div className="flex bg-gray-100 rounded-full p-1 shadow">
            <button
              onClick={() => setPlanType('MONTHLY')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                planType === 'MONTHLY'
                  ? 'bg-black text-white'
                  : 'text-gray-600 cursor-pointer'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPlanType('ANNUALLY')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                planType === 'ANNUALLY'
                  ? 'bg-black text-white'
                  : 'text-gray-600 cursor-pointer'
              }`}
            >
              Yearly
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-center flex-wrap gap-8 z-10 my-5 text-black">
        {!isPending && plans.length === 0 ? (
          <p className="text-center w-full text-gray-500">
            Currently, no subscription plans are available. Please contact our
            support team for assistance.
          </p>
        ) : (
          filteredPlans.map((plan: any) => {
            const { text, disabled } = getButtonConfig(plan?.id);

            const buttonStyle =
              plan?.name === 'CLASSIC' ? 'bg-emerald-green text-white' : '';

            let badge = '';
            if (plan?.type === 'ANNUALLY') {
              const monthlyPlan = plans.find(
                (p: any) => p.type === 'MONTHLY' && p.name === plan.name
              );
              const savings = Number(monthlyPlan?.price * 12 - plan?.price);
              if (savings > 0) {
                badge = `Save $${savings.toFixed(2)} Annually`;
              }
            }
            return (
              <PricingPlanCard
                key={plan?.id}
                plan={{
                  id: plan?.id,
                  title: plan?.name,
                  priceLabel: `$${plan?.price}/`,
                  priceSuffix: plan?.type === 'MONTHLY' ? 'monthly' : 'yearly',
                  image: plan?.name === 'PREMIER' ? Crown : Box,
                  badge,
                  features: plan?.features || [],
                  buttonText: text,
                  buttonStyle,
                  borderColor: plan?.name === 'PREMIER' ? '#0D853D' : '#000000',
                }}
                disabled={disabled}
                onClick={() => handlePlanClick(plan)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
