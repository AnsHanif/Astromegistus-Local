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

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useSnackbar } from 'notistack';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { useStripeProductPayment } from '@/hooks/mutation/product-payment/product-payment';
import { StripeProductPayment } from '@/hooks/mutation/product-payment/product-payment-service';
import { getErrorMessage } from '@/utils/error-handler';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface CartItem {
  id: string;
  name: string;
  price: number;
  livePrice: number;
  automatedPrice: number;
  qty: number;
  image: string;
  duration: string;
  description: string;
  type: 'astrology' | 'coaching';
  selectedPriceType?: 'automated' | 'live' | null;
}

interface CardPaymentFormProps {
  totalAmount: number;
  cartItems: CartItem[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const elementStyle = {
  invalid: { color: '#e5424d' },
  base: {
    fontSize: '16px',
    color: '#000',
    '::placeholder': { color: '#848D8A' },
  },
};

const CardPaymentForm = ({
  totalAmount,
  cartItems,
  isLoading,
  setIsLoading,
}: CardPaymentFormProps) => {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.user.currentUser);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');

  const { mutate } = useStripeProductPayment();

  const skipPaymentDetails =
    userInfo &&
    userInfo.role === 'PAID' &&
    userInfo.defaultPaymentMethod === 'STRIPE';

  const handleBooking = async () => {
    if (!cartItems || cartItems.length === 0) return;
    if (!Number.isFinite(totalAmount)) return;
    if (totalAmount <= 0) return;
    if (!userInfo) return;

    if (userInfo.role !== 'GUEST' && userInfo.role !== 'PAID') {
      closeSnackbar();
      enqueueSnackbar('Only guest and paid users are allowed to buy products', {
        variant: 'error',
      });
      return;
    }

    let formData: StripeProductPayment = { totalAmount, cartItems };

    try {
      if (!skipPaymentDetails) {
        if (!stripe || !elements) return;
        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) return;
        if (!name) {
          closeSnackbar();
          enqueueSnackbar('Please enter card holder name.', {
            variant: 'error',
          });
          return;
        }
        setIsLoading(true);
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
        formData.paymentMethodId = paymentMethod.id;
      }

      setIsLoading(true);
      mutate(formData, {
        onSuccess: (response: any) => {
          setIsLoading(false);
          localStorage.removeItem('cart');
          localStorage.removeItem('final-cart');
          router.push('/products/flow/booking-confirmed');
          queryClient.invalidateQueries({ queryKey: ['purchased-products'] });
          closeSnackbar();
          enqueueSnackbar(response?.message, { variant: 'success' });
        },
        onError: (error: any) => {
          console.log(error);
          setIsLoading(false);
          closeSnackbar();
          enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
        },
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {!skipPaymentDetails && (
        <>
          <div className="text-size-large font-medium md:text-size-heading">
            Payment Details
          </div>

          {/* Card Holder + Number */}
          <div className="flex flex-col md:flex-row gap-4 lg:gap-16 2xl:gap-32">
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
              <Label className="md:text-size-medium font-medium">
                Card Number
              </Label>
              <div className="border-[#093B1D] border px-5 h-12 md:h-15 flex items-center">
                <CardNumberElement
                  options={{ style: elementStyle }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Expiry + CVC */}
          <div className="flex flex-col md:flex-row gap-4 lg:gap-16 2xl:gap-32">
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

          <hr className="my-3" />
        </>
      )}

      <div className="flex justify-between items-center md:text-size-large font-medium">
        <span>Total</span>
        {Number.isFinite(totalAmount)
          ? `$${totalAmount.toFixed(2)}`
          : totalAmount}
      </div>

      <Button
        className="w-full bg-emerald-green rounded-none h-12 md:h-15 text-white hover:bg-emerald-green/90"
        variant={'outline'}
        onClick={handleBooking}
        disabled={
          !userInfo ||
          cartItems.length === 0 ||
          !Number.isFinite(totalAmount) ||
          totalAmount <= 0 ||
          isLoading
        }
      >
        {isLoading ? <SpinnerLoader /> : 'Confirm Booking'}
      </Button>
    </div>
  );
};

export default memo(CardPaymentForm);
