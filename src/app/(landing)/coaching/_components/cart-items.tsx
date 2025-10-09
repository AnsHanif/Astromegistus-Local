// components/CartSummary.tsx
'use client';

import { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export default function CartItems() {
  const router = useRouter();
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

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (!cartItems || !cartItems.length) {
    return null;
  }

  const proceedToPayment = () => {
    router.push('/coaching/payment-info');
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Items In Cart</h2>

      <div className="md:px-4">
        {/* Cart Items */}
        <div className="space-y-2 text-sm">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span>
                {item.qty} x {item.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-medium">${item.price}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        {cartItems.length > 0 && (
          <div className="flex justify-between font-semibold text-base mt-4 border-t pt-2">
            <span>Total</span>
            <span>${total}</span>
          </div>
        )}

        {/* Button */}
        {cartItems.length > 0 && (
          <button onClick={proceedToPayment} className="w-full bg-green-900 text-white font-medium py-3 mt-6 rounded-md hover:bg-green-800 transition cursor-pointer">
            Proceed to Payment
          </button>
        )}
      </div>
    </div>
  );
}
