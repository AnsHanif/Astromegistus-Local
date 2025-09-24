'use client';

import React, { useEffect, useState } from 'react';
import { useGetAllCoachingSessions } from '@/hooks/query/coaching-sessions-queries';
import ProductCard from './product-card';
import { Button } from '@/components/ui/button';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';

const CoachesSession = () => {
  const [cartItems, setCartItems] = useState<string[]>([]);
  const limit = 4; // Items per page

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllCoachingSessions();

  // Load cart items from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      const itemIds = cart.map((item: any) => item.id);
      setCartItems(itemIds);
    }
  }, []);

  // Cart toggle function
  const handleCartToggle = (productId: string) => {
    const storedCart = localStorage.getItem('cart');
    let cart = storedCart ? JSON.parse(storedCart) : [];

    const existingItemIndex = cart.findIndex(
      (item: any) => item.id === productId
    );

    if (existingItemIndex > -1) {
      // Remove from cart
      cart.splice(existingItemIndex, 1);
      setCartItems((prev) => prev.filter((id) => id !== productId));
    } else {
      // Add to cart
      const product = getProductById(productId);
      if (product) {
        const cartItem = {
          id: product.id,
          name: product.title, // Using 'title' from API response
          price: product.price,
          qty: 1,
          image: product.imageUrl || '/images/no-image.png',
          duration: product.duration || '30 + 60 minutes',
          type: 'coaching', // Fixed type
        };
        cart.push(cartItem);
        setCartItems((prev) => [...prev, productId]);
      }
    }

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  // Helper function to get product by ID
  const getProductById = (productId: string) => {
    if (!data?.pages) return null;

    for (const page of data.pages) {
      if (page?.sessions) {
        const product = page.sessions.find((p: any) => p.id === productId);
        if (product) return product;
      }
    }
    return null;
  };

  const allSessions = data?.pages.flatMap((page) => page.sessions) || [];

  return (
    <div className="space-y-8 py-6">
      {isLoading && <SpinnerLoader />}
      {/* Sessions Grid */}
      <div className="grid grid-cols-1 place-items-center md:grid-cols-2 gap-4 md:gap-8 mx-auto">
        {allSessions.map((session) => (
          <ProductCard
            key={session.id}
            productId={session.id}
            isInCart={cartItems.includes(session.id)}
            onCartToggle={handleCartToggle}
            image={session.imageUrl}
            title={session.title}
            description={session.description}
            duration={session.duration}
            buttonText="View Details"
            href={`/products/${session.id}`}
            tag={session.category}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-8 py-3 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark font-medium transition-colors duration-200"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2">
                <SpinnerLoader />
                <span>Loading...</span>
              </div>
            ) : (
              'Load More Sessions'
            )}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {allSessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No coaching sessions available
          </p>
        </div>
      )}
    </div>
  );
};

export default CoachesSession;
