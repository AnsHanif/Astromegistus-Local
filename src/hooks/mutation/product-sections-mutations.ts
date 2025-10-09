'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { productAPI } from '@/services/api/product-api';

interface ProductSection {
  id?: string;
  title: string;
  name?: string;
  description?: string;
  order: number;
}

interface ProductSections {
  keyFocusAreas: ProductSection[];
  chartsUsed: ProductSection[];
  includedFeatures: ProductSection[];
}

// API functions using centralized product API
const updateProductSections = async (
  productId: string,
  sections: ProductSections
): Promise<ProductSections> => {
  // Transform data to match API expectations
  const apiData = {
    keyFocusAreas: sections.keyFocusAreas.map((item) => ({
      title: item.title,
      description: item.description,
      order: item.order,
    })),
    chartsUsed: sections.chartsUsed.map((item) => ({
      name: item.name || item.title, // Handle both name and title
      description: item.description,
      order: item.order,
    })),
    includedFeatures: sections.includedFeatures.map((item) => ({
      title: item.title,
      description: item.description,
      order: item.order,
    })),
  };

  const response = await productAPI.updateProductSections(productId, apiData);
  return response.data.data;
};

const getProductSections = async (
  productId: string
): Promise<ProductSections> => {
  const response = await productAPI.getProductSections(productId);
  const data = response.data.data;

  // Transform backend data to frontend format
  return {
    keyFocusAreas: data.keyFocusAreas || [],
    chartsUsed: (data.chartsUsed || []).map((item: any) => ({
      ...item,
      title: item.name, // Backend uses 'name', frontend expects 'title' for consistency
    })),
    includedFeatures: data.includedFeatures || [],
  };
};

export const useUpdateProductSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      sections,
    }: {
      productId: string;
      sections: ProductSections;
    }) => updateProductSections(productId, sections),
    onSuccess: (data, variables) => {
      enqueueSnackbar('Product sections updated successfully!', {
        variant: 'success',
      });
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({
        queryKey: ['product', variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ['product-sections', variables.productId],
      });
    },
    onError: (error: any) => {
      console.error('Error updating product sections:', error);
      enqueueSnackbar(error?.message || 'Failed to update product sections', {
        variant: 'error',
      });
    },
  });
};

export const useGetProductSections = (productId: string) => {
  return useQuery({
    queryKey: ['product-sections', productId],
    queryFn: () => getProductSections(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in React Query v5)
  });
};

// Product Astrologers Mutation - calls POST /api/products/${productId}/astrologers
const getProductAstrologers = async (productId: string): Promise<any> => {
  console.log(
    'Calling POST /api/products/${productId}/astrologers endpoint...'
  );

  const response = await productAPI.selectAstrologerForProduct(productId);
  return response.data;
};

export const useProductAstrologers = () => {
  return useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      getProductAstrologers(productId),
    onSuccess: (data) => {
      console.log('Successfully fetched astrologers:', data);
    },
    onError: (error: any) => {
      console.error('Error fetching product astrologers:', error);
    },
  });
};
