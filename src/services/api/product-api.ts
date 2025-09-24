import axiosInstance from '../axios';

export const productAPI = {
  getAllProducts: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    productType?: string;
    productPrice?: string;
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
};
