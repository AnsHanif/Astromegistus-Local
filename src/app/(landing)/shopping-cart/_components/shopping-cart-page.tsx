'use client';

import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import CustomCheckbox from '@/components/common/custom-checkbox/custom-checkbox';
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

export default function ShoppingCart() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const userInfo = useSelector((state: RootState) => state.user.currentUser);
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load items from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);

      // Auto-select first available price for astrology items
      const updatedCart = parsedCart.map((item: CartItem) => {
        if (item.type === 'astrology' && !item.selectedPriceType) {
          // Select automated price if available, otherwise live price
          if (Number(item.automatedPrice) > 0) {
            return { ...item, selectedPriceType: 'automated' };
          } else if (Number(item.livePrice) > 0) {
            return { ...item, selectedPriceType: 'live' };
          }
        }
        return item;
      });

      setCartItems(updatedCart);
    }
  }, []);

  // Remove item by id
  const removeItem = (id: string) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    const updatedCart = cartItems.filter((item) => item.id !== id);

    // update state
    setCartItems(updatedCart);

    // update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));

    // Show toast for removal
    if (itemToRemove) {
      enqueueSnackbar(`${itemToRemove.name} removed from cart`, {
        variant: 'info',
      });
    }
  };

  // Calculate total based on selected price types
  const total = cartItems.reduce((sum, item) => {
    if (item.type === 'astrology' && item.selectedPriceType) {
      return (
        sum +
        (item.selectedPriceType === 'automated'
          ? item.automatedPrice
          : item.livePrice)
      );
    }
    return sum + item.price; // For coaching items, use regular price
  }, 0);

  // Handle price type selection (radio button behavior - no unselecting)
  const handlePriceTypeChange = (
    itemId: string,
    priceType: 'automated' | 'live'
  ) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          // Select the new option (no unselecting)
          return { ...item, selectedPriceType: priceType };
        }
        return item;
      })
    );
  };

  const handleProceed = () => {
    if (cartItems.length === 0) return;
    if (!userInfo) {
      localStorage.removeItem('cart');
      router.push('/login');
      return;
    }

    const { role } = userInfo;
    if (role !== 'GUEST' && role !== 'PAID') {
      closeSnackbar();
      enqueueSnackbar('Only Guest and Paid users are allowed to proceed.', {
        variant: 'error',
      });
      return;
    }

    localStorage.setItem('final-cart', JSON.stringify(cartItems));
    router.push('/products/flow/payment-info');
  };

  // Group items by type
  const astrologyItems = cartItems.filter((item) => item.type === 'astrology');
  const coachingItems = cartItems.filter((item) => item.type === 'coaching');

  if (!cartItems || !cartItems.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-[50vh] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-8">Items In Cart</h1>
        <div className="text-gray-500">
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-size-primary md:text-[60px] font-bold text-center mb-8">
        Items In Cart
      </h1>

      <div className="space-y-8">
        {/* Astrology Readings Section */}
        {astrologyItems.length > 0 && (
          <div>
            <h2 className="text-size-heading md:text-size-primary font-bold mb-4">
              Astrology Readings
            </h2>
            <div className="space-y-4">
              {astrologyItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-grey-light-50 p-4"
                >
                  {/* Product Image */}
                  <div className="w-30 h-20 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow ml-4">
                    <h3 className="font-medium text-size-large md:text-size-heading">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      {item.description}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      {item.duration}
                    </p>

                    {/* Price Selection - Only show if prices > 0 */}
                    {((item.automatedPrice && item.automatedPrice > 0) ||
                      (item.livePrice && item.livePrice > 0)) && (
                      <div className="flex flex-col md:flex-row gap-4 md:gap-12 md:items-center">
                        {Number(item.automatedPrice) > 0 && (
                          <div className="flex items-center space-x-2">
                            <CustomCheckbox
                              id={`automated-${item.id}`}
                              checked={item.selectedPriceType === 'automated'}
                              onChange={() =>
                                handlePriceTypeChange(item.id, 'automated')
                              }
                              className="w-5 h-2 text-emerald-green cursor-pointer"
                            />
                            <label
                              htmlFor={`automated-${item.id}`}
                              className="text-sm font-medium mt-1 cursor-pointer"
                            >
                              Automated Reading: ${item.automatedPrice}
                            </label>
                          </div>
                        )}
                        {Number(item.livePrice > 0) && (
                          <div className="flex items-center space-x-2">
                            <CustomCheckbox
                              id={`live-${item.id}`}
                              checked={item.selectedPriceType === 'live'}
                              onChange={() =>
                                handlePriceTypeChange(item.id, 'live')
                              }
                              className="w-5 h-2 text-emerald-green cursor-pointer"
                            />
                            <label
                              htmlFor={`live-${item.id}`}
                              className="text-sm font-medium mt-1 cursor-pointer"
                            >
                              Live Reading: ${item.livePrice}
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 cursor-pointer hover:text-red-700 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coaching Sessions Section */}
        {coachingItems.length > 0 && (
          <div>
            <h2 className="text-size-heading md:text-size-primary font-bold mb-4">
              Coaching Sessions
            </h2>
            <div className="space-y-4">
              {coachingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-grey-light-50 p-4"
                >
                  {/* Product Image */}
                  <div className="w-30 h-20 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow ml-4">
                    <h3 className="font-medium text-size-large md:text-size-heading">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      {item.description}
                    </p>
                    <p className="text-gray-600 text-sm">{item.duration}</p>
                    <p className="font-semibold md:text-size-medium">
                      ${item.price}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="cursor-pointer text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Section */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center text-xl font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <div className="pt-6">
          <button
            className={`w-full bg-emerald-green text-white font-medium py-4 px-6 transition-colors duration-200 ${cartItems.length === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-800 cursor-pointer'}`}
            onClick={handleProceed}
            disabled={cartItems.length === 0}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
