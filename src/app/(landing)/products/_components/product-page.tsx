import React from 'react';
import AstrologyReadingsHeader from './astrology-reading-header';
import ProductsCards from './product-cards';
import ProductBannerSection from './product-banner';
import ProductFeatures from './product-features';
import CartItems from './cart-items';

const ProductPage = () => {
  return (
    <div className="px-4 sm:px-8 mx-auto">
      <AstrologyReadingsHeader />
      <CartItems />
      <ProductBannerSection />
      <div>
        {/* <div className="max-w-6xl"> */}
        <ProductFeatures />
        <ProductsCards />
      </div>
    </div>
  );
};

export default ProductPage;
