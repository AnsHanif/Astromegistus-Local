import Image from 'next/image';
import React from 'react';
import KeyFeaturesCard from './key-features-card';
import { productFeatures } from './product.contant';
import FeatureDetailCard from './feature-detail-card';

const ProductFeatures = () => {
  return (
    <section className="w-full flex flex-col items-center text-center">
      <h2 className="text-2xl md:text-3xl font-medium mt-10 mb-6">
        The Astromegistus Reading – Soul-to-Current-Moment Reading
      </h2>

      {/* Banner Image */}
      <div className="relative w-fullw w-full h-[400px]">
        <Image
          src={'/product-features.png'}
          alt="Banner"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-stretch md:justify-around gap-4 md:gap-8 w-full mt-6">
        <KeyFeaturesCard
          classNames="max-w-[500px] w-full py-8 px-12"
          features={productFeatures}
        />

        <FeatureDetailCard classNames="max-w-[500px] w-full p-6" />
      </div>
    </section>
  );
};

export default ProductFeatures;
