'use client';

import React, { useRef, useEffect, useState } from 'react';
import ProductCard from './product-card';
import FullScreenLoader from '@/components/common/full-screen-loader';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { Button } from '@/components/ui/button';

interface ProductsCardsProps {
  products: any;
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const ProductsCards = ({
  products,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: ProductsCardsProps) => {
  console.log(`Has Next Page `, hasNextPage);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [cartItems, setCartItems] = useState<string[]>([]);

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
      // Add to cart - you'll need to get product details from your products data
      const product = getProductById(productId);
      if (product) {
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product?.pricing?.automated?.discountedPrice ?? 0,
          qty: 1,
          image: product.imageUrl || '/images/no-image.png',
          duration: product.duration || '30 + 60 minutes',
          type: product.type || 'astrology', // You might want to determine this based on product category
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
    if (!products?.pages) return null;

    for (const page of products.pages) {
      if (page?.products) {
        const product = page.products.find((p: any) => p.id === productId);
        if (product) return product;
      }
    }
    return null;
  };

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section>
      <div className="py-6 grid grid-cols-1 place-items-center md:grid-cols-2 gap-4 md:gap-8 mx-auto">
        {isLoading && <FullScreenLoader />}

        {products &&
          products?.pages.flatMap((page: any) =>
            page?.products?.map((product: any) => (
              <ProductCard
                key={product.id}
                {...product}
                productId={product.id}
                isInCart={cartItems.includes(product.id)}
                onCartToggle={handleCartToggle}
                image={product.imageUrl ?? '/images/no-image.png'}
                href={`/products/${product?.id}`}
                description={product.description}
                buttonText="View Details"
                title={product.name}
              />
            ))
          )}
      </div>

      {hasNextPage && (
        <div className="flex justify-center py-6">
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
              'Load More Products'
            )}
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProductsCards;
