import { useInfiniteQuery } from '@tanstack/react-query';
import { productAPI } from '@/services/api/product-api';

interface PurchasedProductsParams {
  category: string;
  limit?: number;
}

export const usePurchasedProducts = (params: PurchasedProductsParams) => {
  return useInfiniteQuery({
    queryKey: ['purchased-products', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await productAPI.getPurchasedProducts({
        ...params,
        page: pageParam,
      });
      return response.data;
    },
    enabled: !!params.category,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const pagination = lastPage?.data?.pagination;
      if (pagination && pagination.page < pagination.totalPages) {
        return pagination.page + 1;
      }
      return undefined;
    },
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
