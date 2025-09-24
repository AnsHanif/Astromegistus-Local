'use client';

import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  duration: string;
  type: 'astrology' | 'coaching';
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  console.log('cart items are : ', cartItems);
  // Load items from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Remove item by id
  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);

    // update state
    setCartItems(updatedCart);

    // update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Group items by type
  const astrologyItems = cartItems.filter((item) => item.type === 'astrology');
  const coachingItems = cartItems.filter((item) => item.type === 'coaching');

  if (!cartItems || !cartItems.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-8">Items In Cart</h1>
        <div className="text-center text-gray-500">
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
                    <p className="text-gray-600 text-sm">
                      {item.duration} minutes
                    </p>
                    <p className="font-medium md:text-size-medium">
                      ${item.price}
                    </p>
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
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow ml-4">
                    <h3 className="font-medium text-size-large md:text-size-heading">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.duration} minutes
                    </p>
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
            <span>${total}</span>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <div className="pt-6">
          <button className="w-full bg-emerald-green text-white font-medium py-4 px-6 cursor-pointer hover:bg-green-800 transition-colors duration-200">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
