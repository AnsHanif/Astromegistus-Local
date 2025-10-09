'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PaymentOption } from '@/app/(pricing)/order-summary/_components/order-summary.types';
import CreditCardIcon from '@/components/assets/svg-icons/pricing/credit-card-icon';
import PaypalIcon from '@/components/assets/svg-icons/pricing/paypal-icon';
import PaymentOptionCard from '@/app/(pricing)/order-summary/_components/payment-options';
import ProductInfoHeader from '../../_components/product-info-header';
import CardPaymentForm from './card-payment-form';
import { useRouter } from 'next/navigation';

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

const paymentOptions: PaymentOption[] = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: <CreditCardIcon className="w-5 h-5" />,
  },
  { id: 'paypal', label: 'PayPal', icon: <PaypalIcon className="w-5 h-5" /> },
];

const PaymentInfoPage = () => {
  const router = useRouter();

  const [selected, setSelected] = useState<string>('card');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => {
    if (item.type === 'astrology' && item.selectedPriceType) {
      return (
        sum +
        (item.selectedPriceType === 'automated'
          ? item.automatedPrice
          : item.livePrice)
      );
    }
    return sum + item.price;
  }, 0);

  useEffect(() => {
    const storedCart = localStorage.getItem('final-cart');

    if (!storedCart) {
      router.push('/shopping-cart');
      return;
    }

    try {
      const parsedCart = JSON.parse(storedCart);

      if (!Array.isArray(parsedCart) || parsedCart.length === 0) {
        router.push('/shopping-cart');
        return;
      }

      setCartItems(parsedCart);
    } catch (error) {
      router.push('/shopping-cart');
    }
  }, [router]);
  return (
    <ProductInfoHeader title="Secure Checkout">
      {/* Payment Section */}
      <div className="w-full">
        <h2 className="text-size-large md:text-size-heading font-semibold mb-2">
          Payment Methods
        </h2>

        <div className="space-y-4">
          {/* Payment Options */}
          <div className="flex flex-col gap-3 mb-6 md:mb-10">
            {paymentOptions.map((option) => (
              <PaymentOptionCard
                key={option.id}
                option={option}
                classNames="md:p-6"
                selected={selected === option.id}
                onSelect={() => setSelected(option.id)}
                disabled={isLoading}
              />
            ))}
          </div>

          <hr />

          {selected === 'card' && (
            <CardPaymentForm
              totalAmount={totalAmount}
              cartItems={cartItems}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {selected === 'paypal' && (
            <div className="my-5">Not available right now</div>
          )}
        </div>
      </div>
    </ProductInfoHeader>
  );
};

export default PaymentInfoPage;
