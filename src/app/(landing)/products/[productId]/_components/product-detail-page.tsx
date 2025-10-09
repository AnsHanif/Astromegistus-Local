'use client';

import React, { useEffect } from 'react';
import ProductHighlightSection from './product-hightlight-section';
import ProductOverview from './product-overview';
import WhatsIncluded from './whats-included';
import ExploreAstroCoaching from './explore-astro-coaching';
import ProductPricingInfo from './product-pricing-info';
import SectionDivider from './section-divider';
import TestimonialSlider from './testimonial-slider';
import { useParams, useRouter } from 'next/navigation';
import { useGetProductDetial } from '@/hooks/query/product-queries';
import { useGetProductSections } from '@/hooks/mutation/product-sections-mutations';
import FullScreenLoader from '@/components/common/full-screen-loader';
import { getErrorMessage } from '@/utils/error-handler';
import { enqueueSnackbar, closeSnackbar } from 'notistack';

const ProductDetailPage = () => {
  const route = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const {
    data: productInfo,
    isLoading,
    isError,
    error,
  } = useGetProductDetial(productId);

  // Get dynamic product sections from backend
  const { data: productSections, isLoading: sectionsLoading } =
    useGetProductSections(productId);

  // Use dynamic data from admin panel
  const sectionsToDisplay = productSections;

  useEffect(() => {
    if (isError) {
      closeSnackbar();
      enqueueSnackbar(getErrorMessage(error), {
        variant: 'error',
      });
    }
  }, [error]);

  const addToCart = () => {
    // Check if product data is available
    if (!productInfo?.product) {
      enqueueSnackbar('Product information is not available', {
        variant: 'error',
      });
      return;
    }

    const product = {
      automatedPrice:
        productInfo?.product?.pricing?.automated?.discountedPrice ?? 0,
      livePrice: productInfo?.product?.pricing?.live?.discountedPrice ?? 0,
      id: productInfo.product.id,
      name: productInfo.product.name,
      description: productInfo.product.description,
      duration: productInfo.product.duration,
      image: productInfo.product.imageUrl,
      qty: 1,
      type: productInfo.product.type || 'astrology',
    };

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    // check if product already exists in cart
    const exists = cart.some((item: any) => item.id === product.id);

    if (!exists) {
      cart.push(product);

      localStorage.setItem('cart', JSON.stringify(cart));

      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));

      // Show toast for addition
      enqueueSnackbar(`${product.name} added to cart`, {
        variant: 'success',
      });

      route.push('/shopping-cart');
    } else {
      enqueueSnackbar('Product already in cart!', {
        variant: 'warning',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <FullScreenLoader bgColor="rgba(255,255,255,0.2)" />
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-6 md:py-10 space-y-6">
        <ProductHighlightSection
          title={productInfo?.product?.name || ''}
          badge={productInfo?.product?.categories?.[0]?.replace('_', ' ') || ''}
          description={productInfo?.product?.description || ''}
          time={productInfo?.product?.duration || ''}
          image={productInfo?.product?.imageUrl || ''}
        />

        <ProductOverview
          description={productInfo?.product?.description}
          focusAreas={sectionsToDisplay?.keyFocusAreas}
          charts={sectionsToDisplay?.chartsUsed}
        />
        <WhatsIncluded items={sectionsToDisplay?.includedFeatures} />
        <SectionDivider
          classNames="max-w-[45rem] mt-[2rem]"
          text="Product Price"
        />
        <ProductPricingInfo
          automatedPrice={
            productInfo?.product?.pricing?.automated?.discountedPrice
          }
          livePrice={productInfo?.product?.pricing?.live?.discountedPrice}
          productType={productInfo?.product?.productType}
          onClick={addToCart}
        />
        <TestimonialSlider />
      </div>

      <ExploreAstroCoaching />
    </div>
  );
};

export default ProductDetailPage;
