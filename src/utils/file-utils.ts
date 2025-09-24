import { adminAPI } from '@/services/api/admin-api';

export interface FileClickOptions {
  onStart?: () => void;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
  onFinally?: () => void;
}

/**
 * Handle file click with loading state and presigned URL generation
 * @param fileKey - S3 key of the file
 * @param options - Callbacks for different states
 */
export const handleFileClick = async (
  fileKey: string,
  options: FileClickOptions = {}
) => {
  const { onStart, onSuccess, onError, onFinally } = options;

  try {
    // Start loading
    onStart?.();

    // Get presigned URL
    const response = await adminAPI.getPresignedUrl(fileKey);
    const presignedUrl = response.data.data.url;

    // Open file in new tab
    window.open(presignedUrl, '_blank', 'noopener,noreferrer');

    // Success callback
    onSuccess?.(presignedUrl);
  } catch (error: any) {
    console.error('Error getting presigned URL:', error);
    const errorMessage = error?.response?.data?.message || 'Failed to access file';
    onError?.(errorMessage);
  } finally {
    // Always called
    onFinally?.();
  }
};

/**
 * Extract S3 key from different file object formats
 * @param file - File object (string URL or object with key property)
 * @returns S3 key or null if not extractable
 */
export const extractS3Key = (file: any): string | null => {
  // If it's a string, try to extract key from URL
  if (typeof file === 'string') {
    // Try to extract key from S3 URL patterns
    const s3UrlPatterns = [
      /\/([^/]+\/[^/]+\/.+)$/, // matches: bucket.s3.region.amazonaws.com/folder/subfolder/file.ext
      /amazonaws\.com\/(.+)$/, // matches: s3.amazonaws.com/folder/file.ext
      /\.s3\..*\.amazonaws\.com\/(.+)$/, // matches: bucket.s3.region.amazonaws.com/folder/file.ext
    ];

    for (const pattern of s3UrlPatterns) {
      const match = file.match(pattern);
      if (match) {
        return match[1];
      }
    }

    // If no pattern matches, assume the string is already a key
    return file;
  }

  // If it's an object, look for key property
  if (typeof file === 'object' && file !== null) {
    return file.key || file.s3Key || null;
  }

  return null;
};