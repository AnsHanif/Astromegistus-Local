import { productAPI } from '@/services/api/product-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

interface ProductQueryParams {
  search?: string;
  filters?: {
    category?: string;
    productType?: string;
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
  };
  limit?: number;
}

export const useGetAllProducts = (params: ProductQueryParams = {}) => {
  const { search = '', filters = {}, limit = 4 } = params;

  // Filter out empty/undefined values from filters
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value && value !== '')
  );

  return useInfiniteQuery({
    queryKey: ['user-products', { search, ...cleanFilters, limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await productAPI.getAllProducts({
        page: pageParam as number,
        limit,
        search,
        ...cleanFilters,
      });
      return response.data?.data;
    },
    getNextPageParam: (lastPage: any, allPages) => {
      if (lastPage && lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
};

export const useGetProductDetial = (id: string) => {
  return useQuery({
    queryKey: ['product-details', id],
    queryFn: async () => {
      const response = await productAPI.getSingleProductDetail(id);
      return response?.data?.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
