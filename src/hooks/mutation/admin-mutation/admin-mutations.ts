import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminAPI,
  AdminLoginRequest,
  CreateUserRequest,
  UpdateUserRequest,
  CreateProductRequest,
  UpdateProductRequest,
  CreateProductWithImageRequest,
  UpdateProductWithImageRequest,
  UserQueryParams,
} from '@/services/api/admin-api';
import { s3ImageAPI } from '@/services/api/s3-image-api';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';

// Admin Login Mutation
export const useAdminLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminLoginRequest) => adminAPI.login(data),
    onSuccess: (response) => {
      console.log('Login response:', response);

      // Store admin token and info
      Cookies.set('adminToken', response.data.data.token, { expires: 7 }); // 7 days
      sessionStorage.setItem('isAdmin', 'true');
      sessionStorage.setItem(
        'adminInfo',
        JSON.stringify(response.data.data.admin)
      );

      console.log('Stored admin token in cookies:', Cookies.get('adminToken'));
      console.log('Stored isAdmin:', sessionStorage.getItem('isAdmin'));

      // Invalidate and refetch admin queries
      queryClient.invalidateQueries({ queryKey: ['admin'] });

      enqueueSnackbar('Login successful!', { variant: 'success' });

      // Add a small delay to ensure storage is set
      setTimeout(() => {
        console.log('Attempting to redirect to /admin');
        router.push('/admin');
        // Fallback redirect
        setTimeout(() => {
          window.location.href = '/admin';
        }, 500);
      }, 100);
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Login failed. Please try again.',
        { variant: 'error' }
      );
    },
  });
};

// User Management Mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => adminAPI.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('User created successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to create user.',
        { variant: 'error' }
      );
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      adminAPI.updateUser(id, data),
    onSuccess: () => {
      console.log('User updated successfully, invalidating cache...');
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('User updated successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update user.',
        { variant: 'error' }
      );
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('User deleted successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to delete user.',
        { variant: 'error' }
      );
    },
  });
};

export const useEnableUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.enableUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('User enabled successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to enable user.',
        { variant: 'error' }
      );
    },
  });
};

export const useDisableUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.disableUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('User disabled successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to disable user.',
        { variant: 'error' }
      );
    },
  });
};

// Product Management Mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => adminAPI.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Product created successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to create product.',
        { variant: 'error' }
      );
    },
  });
};

export const useCreateProductWithImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductWithImageRequest) =>
      adminAPI.createProductWithImage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Product created with image successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to create product with image.',
        { variant: 'error' }
      );
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      adminAPI.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Product updated successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update product.',
        { variant: 'error' }
      );
    },
  });
};

export const useUpdateProductWithImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductWithImageRequest;
    }) => adminAPI.updateProductWithImage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Product updated with image successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update product with image.',
        { variant: 'error' }
      );
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Product deleted successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to delete product.',
        { variant: 'error' }
      );
    },
  });
};

export const useEnableProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.enableProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Product enabled successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to enable product.',
        { variant: 'error' }
      );
    },
  });
};

export const useDisableProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.disableProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Product disabled successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to disable product.',
        { variant: 'error' }
      );
    },
  });
};

// Profile Image Upload Mutation
export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: (file: File) => s3ImageAPI.uploadProfileImageKey(file),
    onSuccess: (response) => {
      enqueueSnackbar('Profile image uploaded successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to upload profile image.',
        { variant: 'error' }
      );
    },
  });
};

// Profile Image Delete Mutation
export const useDeleteProfileImage = () => {
  return useMutation({
    mutationFn: (imageKey: string) =>
      s3ImageAPI.deleteProfileImageByKey(imageKey),
    onSuccess: () => {
      enqueueSnackbar('Profile image deleted successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to delete profile image.',
        { variant: 'error' }
      );
    },
  });
};
