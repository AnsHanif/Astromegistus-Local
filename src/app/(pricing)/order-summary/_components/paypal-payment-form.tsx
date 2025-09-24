'use client';

import { memo } from 'react';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '@/store/slices/user-slice';

interface PaypalPaymentFormProps {
  selectPlan: { id: string };
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaypalPaymentForm = ({
  selectPlan,
  isLoading,
  setIsLoading,
}: PaypalPaymentFormProps) => {
  const session = Cookies.get('temp-nutk-astro');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubscription = async () => {
    if (!session) return Promise.reject();
    if (!selectPlan?.id) return Promise.reject();

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/paypal/subscribe`,
        { planId: selectPlan.id },
        { headers: { Authorization: `Bearer ${session}` } }
      );

      return response?.data?.data?.paypalSubscriptionId;
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      let message = 'Something went wrong. Please try again.';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }
      closeSnackbar();
      enqueueSnackbar(message, { variant: 'error' });
      return Promise.reject(error);
    }
  };

  const handleApprove = async () => {
    if (!session) return Promise.reject();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/paypal/confirmation`,
        { headers: { Authorization: `Bearer ${session}` } }
      );

      setIsLoading(false);
      Cookies.remove('temp-nutk-astro');

      if (response?.data?.data?.token && response?.data?.data?.user) {
        const { user, token } = response?.data?.data;

        let resolvedRole = 'GUEST';
        if (
          Array.isArray(user.subscriptions) &&
          user.subscriptions.length > 0
        ) {
          const planName = user.subscriptions[0]?.plan?.name;
          if (planName === 'CLASSIC') resolvedRole = 'CLASSIC';
          if (planName === 'PREMIER') resolvedRole = 'PREMIER';
        } else {
          resolvedRole = 'GUEST';
        }

        localStorage.setItem('role', resolvedRole);
        Cookies.set('astro-tk', token);
        dispatch(setCurrentUser({ user, token }));
        window.location.href = '/dashboard/booked-readings';
      }

      closeSnackbar();
      enqueueSnackbar(response?.data?.message, { variant: 'success' });
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      let message = 'Something went wrong. Please try again.';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }
      closeSnackbar();
      enqueueSnackbar(message, { variant: 'error' });
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-size-large font-medium md:text-size-heading">
        Payment Details
      </div>

      <PayPalButtons
        fundingSource="paypal"
        style={{ layout: 'vertical' }}
        createSubscription={handleSubscription}
        onApprove={handleApprove}
        onError={(error) => {
          console.error('PayPal Buttons error', error);
          closeSnackbar();
          enqueueSnackbar('PayPal error. Please try again.', {
            variant: 'error',
          });
          setIsLoading(false);
        }}
        onCancel={() => {
          closeSnackbar();
          enqueueSnackbar('PayPal payment canceled.', { variant: 'warning' });
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default memo(PaypalPaymentForm);
