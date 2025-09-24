'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import AstrologyReadingsHeader from './astrology-reading-header';
import ProductsCards from './product-cards';
import ProductBannerSection from './product-banner';
import ProductFeatures from './product-features';
import { useGetAllProducts } from '@/hooks/query/product-queries';
import { enqueueSnackbar, closeSnackbar } from 'notistack';
import { getErrorMessage } from '@/utils/error-handler';
import CoachesSession from './coaching-sessions';

const ProductPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL
  const initialSearch = searchParams.get('search') || '';
  const initialFilters = {
    category: searchParams.get('category') || '',
    productType: searchParams.get('productType') || '',
    productPrice: searchParams.get('productPrice') || '',
    timeDuration: searchParams.get('timeDuration') || '',
  };

  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState(initialFilters);

  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedFilters] = useDebounce(filters, 500);

  // Update URL when search/filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.replace(`?${params.toString()}`);
  }, [debouncedSearch, debouncedFilters, router]);

  // Fetch products based on debounced values
  const {
    data: products,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useGetAllProducts({ search: debouncedSearch, filters: debouncedFilters });

  useEffect(() => {
    if (error) {
      closeSnackbar();
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  }, [error]);

  return (
    <div className="px-4 sm:px-8 mx-auto">
      <AstrologyReadingsHeader
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
      />
      <ProductBannerSection />
      <div>
        <ProductFeatures />
        <ProductsCards
          products={products}
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
      <ProductBannerSection />

      <CoachesSession />
    </div>
  );
};

export default ProductPage;
