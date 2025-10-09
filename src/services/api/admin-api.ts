import adminAxiosInstance from '../admin-axios';
import {
  BOOKING_STATUS,
  READING_TYPE,
  COACHING_CATEGORY,
  USER_ROLE,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
  FILTER_OPTIONS,
  type BookingStatus,
  type ReadingType,
  type CoachingCategory,
  type UserRole,
  type ProductCategory,
  type ProductType,
  type StatusFilter,
  type ReadingTypeFilter,
  type CoachingCategoryFilter,
} from '@/constants/orders';

// Admin API types
export interface AdminLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminLoginResponse {
  message: string;
  status_code: number;
  data: {
    admin: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    token: string;
    expiresIn: number;
    message: string;
    status_code: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  timeZone?: string;
  profilePic?: string;
  profilePictureKey?: string | null;
  verified: boolean;
  status: boolean;
  dummyPassword?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComprehensiveUser extends User {
  // Contact Information
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Professional Information
  languages?: string[];
  astrologyCategories?: string[];
  coachingCategories?: string[];

  // Service Offerings
  offerWebinars?: boolean;
  offerTalkShow?: boolean;
  talkShowDay?: string;
  talkShowTime?: string;

  // Financial Information (admin only)
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  taxIdentification?: string;

  // Additional Information
  additionalComments?: string;
  adminNotes?: string;

  // Related data
  timeSlots?: {
    id: string;
    date: string;
    time: string;
    duration: string;
    isAvailable: boolean;
  }[];
  services?: {
    id: string;
    title: string;
    description?: string;
    category: string;
    createdAt: string;
  }[];
  bookings?: {
    id: string;
    status: string;
    selectedDate?: string;
    selectedTime?: string;
    createdAt: string;
    product: {
      id: string;
      name: string;
      categories: string[];
    };
  }[];
  coachingBookings?: {
    id: string;
    status: string;
    selectedDate?: string;
    selectedTime?: string;
    createdAt: string;
    session: {
      id: string;
      title: string;
      category: string;
      price: number;
    };
  }[];
  subscriptions?: {
    id: string;
    status: boolean;
    startedAt: string;
    endedAt: string;
    plan: {
      name: string;
      type: string;
      price: number;
    };
  }[];

  // Calculated metrics
  metrics?: {
    availableTimeSlots: number;
    totalBookings: number;
    completedBookings: number;
    pendingBookings: number;
    activeServices: number;
    totalServices: number;
    estimatedRevenue: number;
    hasRecentActivity: boolean;
    completionRate: number;
    daysSinceLastActivity: number;
    accountAge: number;
  };

  upcomingTimeSlots?: {
    id: string;
    date: string;
    time: string;
    duration: string;
    isAvailable: boolean;
  }[];

  professionalSummary?: {
    hasContactInfo: boolean;
    hasFinancialInfo: boolean;
    languageCount: number;
    astrologySpecialties: number;
    coachingSpecialties: number;
    offersWebinars: boolean;
    offersTalkShow: boolean;
    profileCompleteness: number;
  };
}

export interface ComprehensiveUserResponse {
  message: string;
  status_code: number;
  data: {
    user: ComprehensiveUser;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse {
  message: string;
  status_code: number;
  data: {
    pagination: Pagination;
    users: User[];
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  productType: ProductType;
  automatedPrice?: number;
  livePrice: number;
  categories: ProductCategory[];
  duration: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'ASTROMEGISTUS' | 'ASTROMEGISTUS_COACH'; // Only these two roles allowed
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  timeZone?: string;
  profilePic?: string;
  profilePictureKey?: string | null;
  verified?: boolean;
  status?: boolean;
  dummyPassword?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'GUEST' | 'PAID' | 'ASTROMEGISTUS' | 'ASTROMEGISTUS_COACH' | 'ADMIN';
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  timeZone?: string;
  profilePic?: string;
  profilePictureKey?: string | null;
  verified?: boolean;
  status?: boolean;

  // Contact Information
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Professional Information
  languages?: string[];
  astrologyCategories?: string[];
  coachingCategories?: string[];

  // Service Offerings
  offerWebinars?: boolean;
  offerTalkShow?: boolean;
  talkShowDay?: string;
  talkShowTime?: string;

  // Financial Information (admin only)
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  taxIdentification?: string;

  // Additional Information
  additionalComments?: string;
  adminNotes?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: 'GUEST' | 'PAID' | 'ASTROMEGISTUS' | 'ASTROMEGISTUS_COACH' | 'ADMIN';
  status?: boolean;
  verified?: boolean;
  search?: string;
}

export interface UserResponse {
  message: string;
  status_code: number;
  data: {
    user: User;
  };
}

export interface CreateProductRequest {
  name: string;
  description: string;
  productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH';
  automatedPrice?: number;
  livePrice: number;
  categories: (
    | 'CORE_INTEGRATIVE'
    | 'NATAL_READING'
    | 'PREDICTIVE'
    | 'CAREER'
    | 'HORARY'
    | 'SYNASTRY'
    | 'ASTROCARTOGRAPHY'
    | 'ELECTIONAL'
    | 'SOLAR_RETURN'
    | 'DRACONIC_NATAL_OVERLAY'
    | 'NATAL'
  )[];
  duration: string;
  imageUrl: string;
  isActive: boolean;
}

export interface CreateProductWithImageRequest {
  name: string;
  description: string;
  productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH';
  automatedPrice?: number;
  livePrice: number;
  categories: (
    | 'CORE_INTEGRATIVE'
    | 'NATAL_READING'
    | 'PREDICTIVE'
    | 'CAREER'
    | 'HORARY'
    | 'SYNASTRY'
    | 'ASTROCARTOGRAPHY'
    | 'ELECTIONAL'
    | 'SOLAR_RETURN'
    | 'DRACONIC_NATAL_OVERLAY'
    | 'NATAL'
  )[];
  duration: string;
  image?: File;
  isActive: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH';
  automatedPrice?: number;
  livePrice?: number;
  categories?: (
    | 'CORE_INTEGRATIVE'
    | 'NATAL_READING'
    | 'PREDICTIVE'
    | 'CAREER'
    | 'HORARY'
    | 'SYNASTRY'
    | 'ASTROCARTOGRAPHY'
    | 'ELECTIONAL'
    | 'SOLAR_RETURN'
    | 'DRACONIC_NATAL_OVERLAY'
    | 'NATAL'
  )[];
  duration?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateProductWithImageRequest {
  name?: string;
  description?: string;
  productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH';
  automatedPrice?: number;
  livePrice?: number;
  categories?: (
    | 'CORE_INTEGRATIVE'
    | 'NATAL_READING'
    | 'PREDICTIVE'
    | 'CAREER'
    | 'HORARY'
    | 'SYNASTRY'
    | 'ASTROCARTOGRAPHY'
    | 'ELECTIONAL'
    | 'SOLAR_RETURN'
    | 'DRACONIC_NATAL_OVERLAY'
    | 'NATAL'
  )[];
  duration?: string;
  image?: File;
  isActive?: boolean;
}

export interface ProductQueryParams {
  search?: string;
  status?: 'All' | 'Active' | 'Inactive';
  category?:
    | 'All'
    | 'CORE_INTEGRATIVE'
    | 'NATAL_READING'
    | 'PREDICTIVE'
    | 'CAREER'
    | 'HORARY'
    | 'SYNASTRY'
    | 'ASTROCARTOGRAPHY'
    | 'ELECTIONAL'
    | 'SOLAR_RETURN'
    | 'DRACONIC_NATAL_OVERLAY'
    | 'NATAL';
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  activeUsers: number;
  activeProducts: number;
  recentUsers: User[];
  recentProducts: Product[];
}

export interface DashboardResponse {
  data: DashboardStats;
  message: string;
  status_code: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: 'freelance' | 'employment';
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  category: 'freelance' | 'employment';
  tags: string[];
  isActive?: boolean;
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  category?: 'freelance' | 'employment';
  tags?: string[];
  isActive?: boolean;
}

export interface JobQueryParams {
  page?: number;
  limit?: number;
  category?: 'freelance' | 'employment' | 'all';
  search?: string;
}

export interface JobsResponse {
  message: string;
  status_code: number;
  data: {
    pagination: Pagination;
    jobs: Job[];
  };
}

export interface JobResponse {
  message: string;
  status_code: number;
  data: {
    job: Job;
  };
}

// Radio Show interfaces
export interface RadioShow {
  id: string;
  showTitle: string;
  hostName: string;
  date: string;
  time: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRadioShowRequest {
  showTitle: string;
  hostName: string;
  date: string;
  time: string;
  isActive?: boolean;
}

export interface UpdateRadioShowRequest {
  showTitle?: string;
  hostName?: string;
  date?: string;
  time?: string;
  isActive?: boolean;
}

export interface RadioShowQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface RadioShowsResponse {
  message: string;
  status_code: number;
  data: {
    pagination: Pagination;
    radioShows: RadioShow[];
  };
}

export interface RadioShowResponse {
  message: string;
  status_code: number;
  data: {
    radioShow: RadioShow;
  };
}
// Orders API types
export interface ReadingOrder {
  id: string;
  type: ReadingType;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  completedAt?: string;
  notes?: string;
  providerId?: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
    role: string;
  } | null;
  product: {
    id: string;
    name: string;
    description?: string;
    categories: ProductCategory[];
    automatedPrice: number;
    livePrice: number;
    duration?: string;
    productType: ProductType;
  };
  persons: {
    id: string;
    fullName: string;
    dateOfBirth: string;
    timeOfBirth?: string;
    placeOfBirth?: string;
  }[];
}

export interface SessionOrder {
  id: string;
  userId: string;
  sessionId: string;
  providerId?: string;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  status: BookingStatus;
  completedAt?: string;
  notes?: string;
  materialFiles?: any[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
    role: string;
  } | null;
  session: {
    id: string;
    title: string;
    description?: string;
    shortDescription?: string;
    duration: string;
    price: number;
    category: CoachingCategory;
    features: string[];
    packages?: any;
    imageUrl?: string;
    imageUrlKey?: string;
  };
}

export interface ReadingOrdersResponse {
  message: string;
  status_code: number;
  data: {
    readings: ReadingOrder[];
    pagination: Pagination;
  };
}

export interface SessionOrdersResponse {
  message: string;
  status_code: number;
  data: {
    sessions: SessionOrder[];
    pagination: Pagination;
  };
}

export interface ReadingOrderResponse {
  message: string;
  status_code: number;
  data: {
    reading: ReadingOrder;
  };
}

export interface SessionOrderResponse {
  message: string;
  status_code: number;
  data: {
    session: SessionOrder;
  };
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: StatusFilter;
  search?: string;
}

export interface ReadingOrderQueryParams extends OrderQueryParams {
  type?: ReadingTypeFilter;
}

export interface SessionOrderQueryParams extends OrderQueryParams {
  category?: CoachingCategoryFilter;
}

export interface UpdateOrderStatusRequest {
  status: BookingStatus;
}

// Admin API functions
export const adminAPI = {
  // Authentication
  login: (data: AdminLoginRequest) =>
    adminAxiosInstance.post<AdminLoginResponse>('/admin/login', data),

  // User Management
  getUsers: (params?: UserQueryParams) =>
    adminAxiosInstance.get<UsersResponse>('/admin/users', { params }),
  getUserById: (id: string) =>
    adminAxiosInstance.get<UserResponse>(`/admin/users/${id}`),
  getComprehensiveUserById: (id: string) =>
    adminAxiosInstance.get<ComprehensiveUserResponse>(`/admin/users/${id}`),
  createUser: (data: CreateUserRequest) =>
    adminAxiosInstance.post<UserResponse>('/admin/users', data),
  updateUser: (id: string, data: UpdateUserRequest) =>
    adminAxiosInstance.put<UserResponse>(`/admin/users/${id}`, data),
  deleteUser: (id: string) => adminAxiosInstance.delete(`/admin/users/${id}`),
  enableUser: (id: string) =>
    adminAxiosInstance.patch<UserResponse>(`/admin/users/${id}/enable`),
  disableUser: (id: string) =>
    adminAxiosInstance.patch<UserResponse>(`/admin/users/${id}/disable`),

  // Product Management
  getProducts: (params?: ProductQueryParams) =>
    adminAxiosInstance.get<Product[]>('/admin/products', { params }),
  getProductById: (id: string) =>
    adminAxiosInstance.get<Product>(`/admin/products/${id}`),
  createProduct: (data: CreateProductRequest) =>
    adminAxiosInstance.post<Product>('/admin/products', data),
  createProductWithImage: (data: CreateProductWithImageRequest) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.productType !== undefined) {
      formData.append('productType', data.productType);
    }
    if (data.automatedPrice !== undefined) {
      formData.append('automatedPrice', data.automatedPrice.toString());
    }
    formData.append('livePrice', data.livePrice.toString());
    formData.append('categories', JSON.stringify(data.categories));
    formData.append('duration', data.duration);
    formData.append('isActive', data.isActive.toString());
    if (data.image) {
      formData.append('image', data.image);
    }
    return adminAxiosInstance.post<Product>('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateProduct: (id: string, data: UpdateProductRequest) =>
    adminAxiosInstance.put<Product>(`/admin/products/${id}`, data),
  updateProductWithImage: (id: string, data: UpdateProductWithImageRequest) => {
    const formData = new FormData();
    if (data.name !== undefined) formData.append('name', data.name);
    if (data.description !== undefined)
      formData.append('description', data.description);
    if (data.productType !== undefined) {
      formData.append('productType', data.productType);
    }
    if (data.automatedPrice !== undefined) {
      formData.append('automatedPrice', data.automatedPrice.toString());
    }
    if (data.livePrice !== undefined) {
      formData.append('livePrice', data.livePrice.toString());
    }
    if (data.categories !== undefined) {
      formData.append('categories', JSON.stringify(data.categories));
    }
    if (data.duration !== undefined) formData.append('duration', data.duration);
    if (data.isActive !== undefined) {
      formData.append('isActive', data.isActive.toString());
    }
    if (data.image) {
      formData.append('image', data.image);
    }
    return adminAxiosInstance.put<Product>(`/admin/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProduct: (id: string) =>
    adminAxiosInstance.delete(`/admin/products/${id}`),
  enableProduct: (id: string) =>
    adminAxiosInstance.patch<Product>(`/admin/products/${id}/enable`),
  disableProduct: (id: string) =>
    adminAxiosInstance.patch<Product>(`/admin/products/${id}/disable`),

  // Dashboard
  getDashboardStats: () =>
    adminAxiosInstance.get<DashboardResponse>('/admin/dashboard'),

  // Job Management
  getJobs: (params?: JobQueryParams) =>
    adminAxiosInstance.get<JobsResponse>('/admin/jobs', { params }),
  getJobById: (id: string) =>
    adminAxiosInstance.get<JobResponse>(`/admin/jobs/${id}`),
  createJob: (data: CreateJobRequest) =>
    adminAxiosInstance.post<JobResponse>('/admin/jobs', data),
  updateJob: (id: string, data: UpdateJobRequest) =>
    adminAxiosInstance.put<JobResponse>(`/admin/jobs/${id}`, data),
  deleteJob: (id: string) => adminAxiosInstance.delete(`/admin/jobs/${id}`),
  enableJob: (id: string) =>
    adminAxiosInstance.patch<JobResponse>(`/admin/jobs/${id}/enable`),
  disableJob: (id: string) =>
    adminAxiosInstance.patch<JobResponse>(`/admin/jobs/${id}/disable`),

  // Radio Show Management
  getRadioShows: (params?: RadioShowQueryParams) =>
    adminAxiosInstance.get<RadioShowsResponse>('/admin/radio-shows', { params }),
  getRadioShowById: (id: string) =>
    adminAxiosInstance.get<RadioShowResponse>(`/admin/radio-shows/${id}`),
  createRadioShow: (data: CreateRadioShowRequest) =>
    adminAxiosInstance.post<RadioShowResponse>('/admin/radio-shows', data),
  updateRadioShow: (id: string, data: UpdateRadioShowRequest) =>
    adminAxiosInstance.put<RadioShowResponse>(`/admin/radio-shows/${id}`, data),
  deleteRadioShow: (id: string) => adminAxiosInstance.delete(`/admin/radio-shows/${id}`),
  enableRadioShow: (id: string) =>
    adminAxiosInstance.patch<RadioShowResponse>(`/admin/radio-shows/${id}/enable`),
  disableRadioShow: (id: string) =>
    adminAxiosInstance.patch<RadioShowResponse>(`/admin/radio-shows/${id}/disable`),
  // Orders Management
  getReadingOrders: (params?: ReadingOrderQueryParams) =>
    adminAxiosInstance.get<ReadingOrdersResponse>('/admin/orders/readings', {
      params,
    }),
  getSessionOrders: (params?: SessionOrderQueryParams) =>
    adminAxiosInstance.get<SessionOrdersResponse>('/admin/orders/sessions', {
      params,
    }),
  getReadingOrderById: (id: string) =>
    adminAxiosInstance.get<ReadingOrderResponse>(
      `/admin/orders/readings/${id}`
    ),
  getSessionOrderById: (id: string) =>
    adminAxiosInstance.get<SessionOrderResponse>(
      `/admin/orders/sessions/${id}`
    ),
  updateReadingOrderStatus: (id: string, data: UpdateOrderStatusRequest) =>
    adminAxiosInstance.patch<ReadingOrderResponse>(
      `/admin/orders/readings/${id}/status`,
      data
    ),
  updateSessionOrderStatus: (id: string, data: UpdateOrderStatusRequest) =>
    adminAxiosInstance.patch<SessionOrderResponse>(
      `/admin/orders/sessions/${id}/status`,
      data
    ),

  // S3 File Access
  getPresignedUrl: (key: string) =>
    adminAxiosInstance.get<{
      message: string;
      status_code: number;
      data: { url: string; key: string; expiresIn: number };
    }>(`/s3/presigned-url?key=${encodeURIComponent(key)}`),
};
