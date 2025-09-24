import React, { Suspense } from 'react';
import OrderSummaryPage from './_components/order-summary-page';
import FullScreenLoader from '@/components/common/full-screen-loader';

const OrderSummary = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <OrderSummaryPage />
    </Suspense>
  );
};

export default OrderSummary;
