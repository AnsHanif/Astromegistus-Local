import axiosInstance from '../axios';
import adminAxiosInstance from '../admin-axios';

// Types for S3 image operations
export interface PresignedUrlResponse {
  success: boolean;
  message: string;
  data: {
    userId?: string;
    userName?: string;
    productId?: string;
    productName?: string;
    imageUrl: string;
    presignedUrl?: string;
    expiresIn?: number;
    type?: string;
  };
}

export interface ImageUploadResponse {
  success: boolean;
  imageUrl: string;
  message?: string;
  data?: {
    imageUrl: string;
    imageUrlKey?: string;
  };
}

export interface ImageDeleteResponse {
  success: boolean;
  message?: string;
  data?: {
    deleted: boolean;
    imageUrl?: string;
  };
}

// S3 Image API functions
export const s3ImageAPI = {
  // User Profile Picture Endpoints
  getUserProfilePresignedUrl: () =>
    axiosInstance.get<PresignedUrlResponse>('/images/profile'),

  uploadUserProfileImage: (file: File) =>
    axiosInstance.post<ImageUploadResponse>('/images/profile', file, {
      headers: {
        'Content-Type': file.type,
      },
    }),

  deleteUserProfileImage: () =>
    axiosInstance.delete<ImageDeleteResponse>('/images/profile'),

  // Product Image Endpoints
  getProductImagePresignedUrl: (productId: string) =>
    axiosInstance.get<PresignedUrlResponse>(`/images/product/${productId}`),

  uploadProductImage: (file: File) =>
    axiosInstance.post<ImageUploadResponse>(`/images/product`, file, {
      headers: {
        'Content-Type': file.type,
      },
    }),

  deleteProductImage: (productId: string) =>
    axiosInstance.delete<ImageDeleteResponse>(`/images/product/${productId}`),

  // Product Image Endpoints by Key
  getProductImageByKey: (imageKey: string) =>
    axiosInstance.get<PresignedUrlResponse>(`/images/product/key/${imageKey}`),

  uploadProductImageByKey: (imageKey: string, file: File) =>
    axiosInstance.post<ImageUploadResponse>(
      `/images/product/key/${imageKey}`,
      file,
      {
        headers: {
          'Content-Type': file.type,
        },
      }
    ),

  deleteProductImageByKey: (imageKey: string) =>
    axiosInstance.delete<ImageDeleteResponse>(
      `/images/product/key/${imageKey}`
    ),

  // Admin endpoints for managing any user's profile picture
  getAdminUserProfilePresignedUrl: (userId: string) =>
    adminAxiosInstance.get<PresignedUrlResponse>(
      `/admin/images/profile/${userId}`
    ),

  uploadAdminUserProfileImage: (userId: string, file: File) =>
    adminAxiosInstance.post<ImageUploadResponse>(
      `/admin/images/profile/${userId}`,
      file,
      {
        headers: {
          'Content-Type': file.type,
        },
      }
    ),

  // Profile Image Key-based Endpoints (Simple upload)
  uploadProfileImageKey: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosInstance.post<{
      success: boolean;
      message: string;
      data: {
        imageKey: string;
        type: string;
      };
    }>('/images/profile/key', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getProfileImageByKey: (imageKey: string) =>
    axiosInstance.get<{
      success: boolean;
      message: string;
      data: {
        imageKey: string;
        imageUrl: string;
        expiresIn: number;
      };
    }>(`/images/profile/key/${encodeURIComponent(imageKey)}`),

  deleteProfileImageByKey: (imageKey: string) =>
    axiosInstance.delete<{
      success: boolean;
      message: string;
      data: {
        imageKey: string;
      };
    }>(`/images/profile/key/${encodeURIComponent(imageKey)}`),

  deleteAdminUserProfileImage: (userId: string) =>
    adminAxiosInstance.delete<ImageDeleteResponse>(
      `/admin/images/profile/${userId}`
    ),

  // Admin endpoints for managing any product's image
  getAdminProductImagePresignedUrl: (productId: string) =>
    adminAxiosInstance.get<PresignedUrlResponse>(
      `/admin/images/product/${productId}`
    ),

  uploadAdminProductImage: (productId: string, file: File) =>
    adminAxiosInstance.post<ImageUploadResponse>(
      `/admin/images/product/${productId}`,
      file,
      {
        headers: {
          'Content-Type': file.type,
        },
      }
    ),

  deleteAdminProductImage: (productId: string) =>
    adminAxiosInstance.delete<ImageDeleteResponse>(
      `/admin/images/product/${productId}`
    ),

  // Admin Product Image Endpoints by Key
  getAdminProductImageByKey: (imageKey: string) =>
    adminAxiosInstance.get<PresignedUrlResponse>(
      `/admin/images/product/key/${imageKey}`
    ),

  uploadAdminProductImageByKey: (imageKey: string, file: File) =>
    adminAxiosInstance.post<ImageUploadResponse>(
      `/admin/images/product/key/${imageKey}`,
      file,
      {
        headers: {
          'Content-Type': file.type,
        },
      }
    ),

  deleteAdminProductImageByKey: (imageKey: string) =>
    adminAxiosInstance.delete<ImageDeleteResponse>(
      `/admin/images/product/key/${imageKey}`
    ),

  // Utility function to get image URL from response
  getImageUrlFromResponse: (response: ImageUploadResponse): string => {
    return response.data?.imageUrl || response.imageUrl;
  },

  // Utility function to check if response is successful
  isResponseSuccessful: (response: any): boolean => {
    return response?.success === true || response?.status === 200;
  },

  // Smart upload function that tries different methods
  smartUploadProductImage: async (
    productId: string,
    file: File,
    imageKey?: string
  ): Promise<ImageUploadResponse> => {
    try {
      // If imageKey is provided, try uploading by key first
      if (imageKey && isValidImageKey(imageKey)) {
        const response = await s3ImageAPI.uploadAdminProductImageByKey(
          imageKey,
          file
        );
        return response.data;
      }

      // Fallback to product ID upload
      const response = await s3ImageAPI.uploadAdminProductImage(
        productId,
        file
      );
      return response.data;
    } catch (error) {
      console.error('Smart upload failed:', error);
      throw error;
    }
  },

  // Smart delete function that tries different methods
  smartDeleteProductImage: async (
    productId: string,
    imageUrl?: string
  ): Promise<ImageDeleteResponse> => {
    try {
      // If imageUrl is provided, try extracting key and deleting by key
      if (imageUrl) {
        const imageKey = extractImageKey(imageUrl);
        if (imageKey && isValidImageKey(imageKey)) {
          const response =
            await s3ImageAPI.deleteAdminProductImageByKey(imageKey);
          return response.data;
        }
      }

      // Fallback to product ID deletion
      const response = await s3ImageAPI.deleteAdminProductImage(productId);
      return response.data;
    } catch (error) {
      console.error('Smart delete failed:', error);
      throw error;
    }
  },
};

// Utility function to upload file to S3 using presigned URL
export const uploadFileToS3 = async (
  presignedUrl: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200 || xhr.status === 204) {
        // For presigned URLs, we need to extract the base URL
        // Remove query parameters to get clean image URL
        const imageUrl = presignedUrl.split('?')[0];
        resolve(imageUrl);
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });

    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timed out'));
    });

    // Set timeout to 30 seconds
    xhr.timeout = 30000;

    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
};

// Utility function to validate image file
export const validateImageFile = (
  file: File,
  maxSizeMB: number = 5
): { isValid: boolean; error?: string } => {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      error: 'No file selected',
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Please upload a valid image file (JPEG, PNG, WebP, or GIF). Current type: ${file.type}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB. Current size: ${fileSizeMB}MB`,
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty',
    };
  }

  return { isValid: true };
};

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Utility function to get file extension
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Utility function to generate unique filename
export const generateUniqueFilename = (
  originalName: string,
  prefix?: string
): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const baseName = originalName.replace(/\.[^/.]+$/, '');

  return `${prefix || 'image'}_${baseName}_${timestamp}_${random}.${extension}`;
};

// Utility function to check if URL is valid
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Utility function to extract image URL from various response formats
export const extractImageUrl = (response: any): string | null => {
  // Handle different response structures
  if (response?.data?.data?.imageUrl) {
    return response.data.data.imageUrl;
  }
  if (response?.data?.imageUrl) {
    return response.data.imageUrl;
  }
  if (response?.imageUrl) {
    return response.imageUrl;
  }
  if (typeof response === 'string' && isValidImageUrl(response)) {
    return response;
  }
  return null;
};

// Utility function to extract image key from URL
export const extractImageKey = (imageUrl: string): string | null => {
  try {
    const url = new URL(imageUrl);
    // Extract the path after the domain, removing leading slash
    const path = url.pathname.substring(1);
    return path || null;
  } catch {
    return null;
  }
};

// Utility function to check if image key is valid
export const isValidImageKey = (imageKey: string): boolean => {
  // Basic validation for image key format
  // Should contain forward slashes and have a file extension
  return (
    imageKey.includes('/') && imageKey.includes('.') && imageKey.length > 0
  );
};

// Utility function to generate image key for product
export const generateProductImageKey = (
  productId: string,
  filename: string,
  prefix: string = 'product-images'
): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(filename);

  return `${prefix}/${productId}/${timestamp}_${random}.${extension}`;
};

// Utility function to generate image key for user profile
export const generateUserProfileImageKey = (
  userId: string,
  filename: string,
  prefix: string = 'user-profiles'
): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(filename);

  return `${prefix}/${userId}/${timestamp}_${random}.${extension}`;
};
