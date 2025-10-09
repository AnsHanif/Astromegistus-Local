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
  CreateJobRequest,
  UpdateJobRequest,
  CreateRadioShowRequest,
  UpdateRadioShowRequest,
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

      // Calculate cookie expiry days based on backend response
      const expiryDays = response.data.data.expiresIn ?
        Math.ceil(response.data.data.expiresIn / (24 * 60 * 60 * 1000)) : 7;

      // Store admin token and info
      Cookies.set('adminToken', response.data.data.token, { expires: expiryDays });
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
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
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

// Profile Image Upload Mutation (Regular users)
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

// Profile Image Delete Mutation (Regular users)
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

// Admin Profile Image Upload Mutation
export const useAdminUploadProfileImage = () => {
  return useMutation({
    mutationFn: (file: File) => s3ImageAPI.uploadAdminProfileImageKey(file),
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

// Admin Profile Image Delete Mutation
export const useAdminDeleteProfileImage = () => {
  return useMutation({
    mutationFn: (imageKey: string) =>
      s3ImageAPI.deleteAdminProfileImageByKey(imageKey),
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

// Job Management Mutations
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobRequest) => adminAPI.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'jobs'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Job created successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to create job.',
        { variant: 'error' }
      );
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobRequest }) =>
      adminAPI.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'jobs'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Job updated successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update job.',
        { variant: 'error' }
      );
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'jobs'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Job deleted successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to delete job.',
        { variant: 'error' }
      );
    },
  });
};

export const useEnableJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.enableJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'jobs'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Job enabled successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to enable job.',
        { variant: 'error' }
      );
    },
  });
};

export const useDisableJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.disableJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'jobs'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Job disabled successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to disable job.',
        { variant: 'error' }
      );
    },
  });
};

// Radio Show Management Mutations
export const useCreateRadioShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRadioShowRequest) => adminAPI.createRadioShow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'radio-shows'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['radioShows'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Radio show created successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to create radio show.',
        { variant: 'error' }
      );
    },
  });
};

export const useUpdateRadioShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRadioShowRequest }) =>
      adminAPI.updateRadioShow(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'radio-shows'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['radioShows'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Radio show updated successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update radio show.',
        { variant: 'error' }
      );
    },
  });
};

export const useDeleteRadioShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.deleteRadioShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'radio-shows'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['radioShows'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Radio show deleted successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to delete radio show.',
        { variant: 'error' }
      );
    },
  });
};

export const useEnableRadioShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.enableRadioShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'radio-shows'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['radioShows'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Radio show enabled successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to enable radio show.',
        { variant: 'error' }
      );
    },
  });
};

export const useDisableRadioShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.disableRadioShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'radio-shows'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['radioShows'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      enqueueSnackbar('Radio show disabled successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to disable radio show.',
        { variant: 'error' }
      );
    },
  });
};
