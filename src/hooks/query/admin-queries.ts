import { useQuery } from '@tanstack/react-query';
import {
  adminAPI,
  UserQueryParams,
  ProductQueryParams,
  ReadingOrderQueryParams,
  SessionOrderQueryParams,
} from '@/services/api/admin-api';

// Admin Queries
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminAPI.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User Management Queries
export const useAdminUsers = (params?: UserQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminAPI.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminAPI.getUserById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Product Management Queries
export const useAdminProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => adminAPI.getProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAdminProduct = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: () => adminAPI.getProductById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Orders Management Queries
export const useAdminReadingOrders = (params?: ReadingOrderQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'orders', 'readings', params],
    queryFn: () => adminAPI.getReadingOrders(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAdminSessionOrders = (params?: SessionOrderQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'orders', 'sessions', params],
    queryFn: () => adminAPI.getSessionOrders(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAdminReadingOrder = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'orders', 'readings', id],
    queryFn: () => adminAPI.getReadingOrderById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAdminSessionOrder = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'orders', 'sessions', id],
    queryFn: () => adminAPI.getSessionOrderById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
