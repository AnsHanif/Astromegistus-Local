import { useQuery } from '@tanstack/react-query';
import {
  adminAPI,
  UserQueryParams,
  ProductQueryParams,
  JobQueryParams,
  RadioShowQueryParams,
  ReadingOrderQueryParams,
  SessionOrderQueryParams,
} from '@/services/api/admin-api';
import Cookies from 'js-cookie';

// Helper function to check admin authentication
const useAdminAuth = () => {
  const adminToken = Cookies.get('adminToken');
  const isAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('isAdmin') : null;
  return !!(adminToken && isAdmin === 'true');
};

// Admin Queries
export const useAdminDashboard = () => {
  const isAuthenticated = useAdminAuth();

  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminAPI.getDashboardStats(),
    enabled: isAuthenticated, // Only run if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User Management Queries
export const useAdminUsers = (params?: UserQueryParams) => {
  const isAuthenticated = useAdminAuth();

  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminAPI.getUsers(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAdminUser = (id: string) => {
  const isAuthenticated = useAdminAuth();

  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminAPI.getUserById(id),
    enabled: isAuthenticated && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useComprehensiveAdminUser = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'users', 'comprehensive', id],
    queryFn: () => adminAPI.getComprehensiveUserById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Product Management Queries
export const useAdminProducts = (params?: ProductQueryParams) => {
  const isAuthenticated = useAdminAuth();

  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => adminAPI.getProducts(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAdminProduct = (id: string) => {
  const isAuthenticated = useAdminAuth();

  return useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: () => adminAPI.getProductById(id),
    enabled: isAuthenticated && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Job Management Queries
export const useAdminJobs = (params?: JobQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'jobs', params],
    queryFn: () => adminAPI.getJobs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAdminJob = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'jobs', id],
    queryFn: () => adminAPI.getJobById(id),
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

// Radio Show Management Queries
export const useAdminRadioShows = (params?: RadioShowQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'radio-shows', params],
    queryFn: () => adminAPI.getRadioShows(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAdminRadioShow = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'radio-shows', id],
    queryFn: () => adminAPI.getRadioShowById(id),
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
