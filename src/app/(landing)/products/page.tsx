import React, { Suspense } from 'react';
import ProductPage from './flow/_components/product-page';

const Products = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden-glow"></div>
    </div>}>
      <ProductPage />
    </Suspense>
  );
};

export default Products;
