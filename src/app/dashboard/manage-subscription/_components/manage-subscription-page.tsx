'use client';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ConfirmationModal from '../../_components/confirmation-modal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useSnackbar } from 'notistack';
import { useCancelSubscription } from '@/hooks/mutation/profile-mutation/profile';
import { getErrorMessage } from '@/utils/error-handler';
import { useQueryClient } from '@tanstack/react-query';
import PlansSection from './plans-section';

const formatName = (name?: string) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export default function ManageSubscriptionPage() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const userInfo = useSelector((state: RootState) => state.user.currentUser);

  const { mutate, isPending } = useCancelSubscription();

  const [showPlan, setShowPlan] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const role = userInfo?.role;
  const subscriptions = userInfo?.subscriptions || [];
  const hasActiveSub = subscriptions.length > 0 && subscriptions[0]?.status;

  const isPaidWithSub = role === 'PAID' && hasActiveSub;
  const isPaidWithoutSub = role === 'PAID' && !hasActiveSub;
  const isGuest = role === 'GUEST';
  const isOtherRole = role !== 'PAID' && role !== 'GUEST';

  const handleCancel = async () => {
    if (!isPaidWithSub) {
      closeSnackbar();
      enqueueSnackbar(
        'Cancel is only available for paid users with an active subscription.',
        { variant: 'error' }
      );
      return;
    }

    mutate(
      { subscriptionId: subscriptions[0]?.id },
      {
        onSuccess: (response: any) => {
          localStorage.removeItem('cart');
          localStorage.removeItem('final-cart');
          queryClient.invalidateQueries({ queryKey: ['authUser'] });
          closeSnackbar();
          enqueueSnackbar(response?.message, { variant: 'success' });
          setIsModal(false);
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
  return (
    <>
      {!showPlan ? (
        <div className="space-y-8">
          <h1 className="text-size-medium md:text-size-large font-semibold">
            Current Subscription Details
          </h1>

          {isPaidWithSub ? (
            <div className="flex items-center justify-between px-4 py-6 md:px-8 md:py-8 border border-golden-glow">
              <h1 className="text-size-heading md:text-size-primary font-bold bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark bg-clip-text text-transparent">
                {formatName(subscriptions[0]?.plan?.name)} Subscription
              </h1>
              <div className="text-right">
                <p className="text-size-tertiary font-normal mb-1">
                  Subscription renews on
                </p>
                <p className="font-bold text-size-medium">
                  {new Date(subscriptions[0]?.endedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : isPaidWithoutSub || isGuest ? (
            <div
              className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 cursor-pointer border transition-all duration-200 hover:bg-white/10 hover:shadow-md"
              onClick={() => setShowPlan(true)}
            >
              <h1 className="text-size-large md:text-size-heading font-semibold">
                Subscribe a Plan
              </h1>
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          ) : isOtherRole && userInfo ? (
            <div className="p-6 text-center border border-red-400 text-red-600">
              Subscription management is not available for role (
              <strong>{role}</strong>).
            </div>
          ) : null}

          <div
            className={`flex items-center justify-between px-4 py-3 md:px-8 md:py-5 border transition-all duration-200 ${
              isPaidWithSub
                ? 'cursor-pointer hover:bg-white/10 hover:shadow-md'
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => isPaidWithSub && setShowPlan(true)}
          >
            <h1 className="text-size-large md:text-size-heading font-semibold">
              Change Plan
            </h1>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
          </div>

          <div
            className={`flex items-center justify-between px-4 py-3 md:px-8 md:py-5 border transition-all duration-200 ${
              isPaidWithSub
                ? 'cursor-pointer hover:bg-white/10 hover:shadow-md'
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => isPaidWithSub && setIsModal(true)}
          >
            <h1 className="text-size-large md:text-size-heading font-semibold">
              Cancel Subscription
            </h1>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
          </div>

          <ConfirmationModal
            open={isModal}
            onClose={() => setIsModal(false)}
            onSubmit={handleCancel}
            title="Cancel Subscription"
            subTitle={`${formatName(subscriptions[0]?.plan?.name)} Plan – $${subscriptions[0]?.plan?.price}/${subscriptions[0]?.plan?.type?.toLowerCase() === 'monthly' ? 'Month' : 'Year'}`}
            description="You'll lose access to plan features immediately after cancellation."
            btn1Title="Yes, Cancel"
            btn2Title="Keep Subscription"
            iconType="cancelSub"
            isLoading={isPending}
            classNames="!bg-[#212121] text-white"
          />
        </div>
      ) : (
        <PlansSection onBack={() => setShowPlan(false)} />
      )}
    </>
  );
}
