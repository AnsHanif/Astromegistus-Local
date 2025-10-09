import { usePurchasedProducts } from '@/hooks/query/purchased-products-queries';
import { PURCHASED_PRODUCTS_TYPE } from '@/types';
import React from 'react';
import ReadingSessionCard from './reading-card-session';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { Button } from '@/components/ui/button';

const CoachingSessions = () => {
  const {
    data: purchasedProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = usePurchasedProducts({
    category: PURCHASED_PRODUCTS_TYPE.COACHING,
    limit: 5,
  });

  // Calculate total count from all pages
  const totalCount =
    purchasedProducts?.pages.reduce((total, page) => {
      return total + (page?.data?.products?.length || 0);
    }, 0) || 0;

  // Flatten all products from all pages
  const allProducts =
    purchasedProducts?.pages.flatMap(
      (page: any) => page?.data?.products || []
    ) || [];

  return (
    <div className='mt-4'>
      <h2 className="text-size-large md:text-size-heading font-medium mb-2">
        Scheduled Coaching Sessions{' '}
        <span className="text-sm">({totalCount})</span>
      </h2>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <SpinnerLoader />
        </div>
      )}

      {/* Products List */}
      {!isLoading && (
        <div className="max-h-[50vh] overflow-y-auto">
          {allProducts.length > 0 ? (
            allProducts.map((product: any) => (
              <ReadingSessionCard
                key={product.id}
                title={product.name}
                type="session"
                duration={product.duration}
                categories={product.categories}
                actionText="View Session"
                classNames="mb-6"
                href={`/products/flow/coaching-sessions?productId=${product.coachingId}&itemId=${product.id}`}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No coaching sessions available at the moment.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasNextPage && (
            <div className="text-center mt-6">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                className="px-8 py-3 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark font-medium transition-colors duration-200"
              >
                {isFetchingNextPage ? <SpinnerLoader /> : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoachingSessions;
