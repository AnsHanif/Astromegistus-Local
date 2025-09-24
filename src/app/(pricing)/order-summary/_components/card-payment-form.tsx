'use client';

import { useState, memo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useSnackbar } from 'notistack';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import Cookies from 'js-cookie';
import { useStripeSubscription } from '@/hooks/mutation/order-summary-mutation/order-summary';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '@/store/slices/user-slice';
import { useRouter } from 'next/navigation';

const elementStyle = {
  invalid: { color: '#e5424d' },
  base: {
    fontSize: '16px',
    color: '#000',
    '::placeholder': { color: '#848D8A' },
  },
};

interface CardPaymentFormProps {
  selectPlan: { id: string };
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CardPaymentForm = ({
  selectPlan,
  isLoading,
  setIsLoading,
}: CardPaymentFormProps) => {
  const session = Cookies.get('temp-nutk-astro');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();

  const stripe = useStripe();
  const elements = useElements();

  const { mutate } = useStripeSubscription();

  const [name, setName] = useState('');

  const handlePay = async () => {
    if (!session) return;
    if (!selectPlan?.id) return;
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    if (!name) {
      closeSnackbar();
      enqueueSnackbar('Please enter card holder name.', { variant: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { name },
      });

      if (error) {
        closeSnackbar();
        enqueueSnackbar(error.message, { variant: 'error' });
        setIsLoading(false);
        return;
      }

      const formData = {
        token: session,
        planId: selectPlan?.id,
        paymentMethodId: paymentMethod.id,
      };

      mutate(formData, {
        onSuccess: (response: any) => {
          setIsLoading(false);
          Cookies.remove('temp-nutk-astro');

          if (response?.data?.token && response?.data?.user) {
            const { user, token } = response.data;

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
          enqueueSnackbar(response?.message, { variant: 'success' });
        },
        onError: (error: any) => {
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
        },
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-size-large font-medium md:text-size-heading">
        Payment Details
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full gap-3">
          <Label className="md:text-size-medium font-medium">
            Name on Card
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-[#093B1D] w-full px-5 focus:border-black focus:ring-0 focus:outline-none"
            placeholder="John Doe"
          />
        </div>

        <div className="flex flex-col w-full gap-3">
          <Label className="md:text-size-medium font-medium">Card Number</Label>
          <div className="border-[#093B1D] border px-5 h-12 md:h-15 flex items-center">
            <CardNumberElement
              options={{ style: elementStyle }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-3 w-full">
          <Label className="md:text-size-medium font-medium">Expiry</Label>
          <div className="border-[#093B1D] border px-5 h-12 md:h-15 flex items-center">
            <CardExpiryElement
              options={{ style: elementStyle }}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Label className="md:text-size-medium font-medium">CVC</Label>
          <div className="border-[#093B1D] border px-5 h-12 md:h-15 flex items-center">
            <CardCvcElement
              options={{ style: elementStyle, placeholder: '123' }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={handlePay} disabled={isLoading}>
        {isLoading ? <SpinnerLoader /> : 'Pay Now'}
      </Button>
    </div>
  );
};

export default memo(CardPaymentForm);
