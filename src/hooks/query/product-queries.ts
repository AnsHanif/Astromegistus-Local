import { productAPI } from '@/services/api/product-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

interface ProductQueryParams {
  search?: string;
  filters?: {
    category?: string;
    productType?: string;
    productPrice?: string;
    timeDuration?: string;
  };
  limit?: number;
}

export const useGetAllProducts = (params: ProductQueryParams = {}) => {
  const { search = '', filters = {}, limit = 4 } = params;

  return useInfiniteQuery({
    queryKey: ['user-products', { search, ...filters, limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await productAPI.getAllProducts({
        page: pageParam as number,
        limit,
        search,
        ...filters,
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
  });
};
