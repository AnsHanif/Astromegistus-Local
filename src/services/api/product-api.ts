import axiosInstance from '../axios';

export const productAPI = {
  getAllProducts: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    productType?: string;
    minPrice?: string;
    maxPrice?: string;
    timeDuration?: string;
  }) => {
    const response = await axiosInstance.get(`/admin/products`, {
      params,
    });
    return response;
  },

  getSingleProductDetail: async (id: string) => {
    const response = await axiosInstance.get(`/admin/products/${id}`);
    return response;
  },

  // Get purchased products with dynamic category
  getPurchasedProducts: async (params: {
    category: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axiosInstance.get('/purchased-products', {
      params: {
        category: params.category,
        page: params.page || 1,
        limit: params.limit || 10,
      },
    });
    return response;
  },

  // Product Sections API
  getProductSections: async (productId: string) => {
    const response = await axiosInstance.get(
      `/admin/products/${productId}/sections`
    );
    return response;
  },

  updateProductSections: async (
    productId: string,
    sections: {
      keyFocusAreas?: Array<{
        title: string;
        description?: string;
        order: number;
      }>;
      chartsUsed?: Array<{ name: string; description?: string; order: number }>;
      includedFeatures?: Array<{
        title: string;
        description?: string;
        order: number;
      }>;
    }
  ) => {
    const response = await axiosInstance.put(
      `/admin/products/${productId}/sections`,
      sections
    );
    return response;
  },

  selectAstrologerForProduct: async (productId: string) => {
    const response = await axiosInstance.post(
      `/api/products/astrologers/random`,
      { productId }
    );
    return response;
  },
};
