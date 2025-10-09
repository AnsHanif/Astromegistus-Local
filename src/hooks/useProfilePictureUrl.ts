import { useState, useEffect } from 'react';
import { s3ImageAPI } from '../services/api/s3-image-api';

interface UseProfilePictureUrlResult {
  profilePicUrl: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch profile picture URL from S3 key
 * @param userProfilePic - S3 key or full URL
 * @returns { profilePicUrl, loading, error }
 */
export const useProfilePictureUrl = (
  userProfilePic?: string
): UseProfilePictureUrlResult => {
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilePicUrl = async () => {
      if (!userProfilePic) {
        setProfilePicUrl(null);
        setError(null);
        return;
      }

      // Check if it's already a full URL (starts with http)
      if (userProfilePic.startsWith('http')) {
        setProfilePicUrl(userProfilePic);
        setError(null);
        return;
      }

      // If it's an S3 key, get the presigned URL
      try {
        setLoading(true);
        setError(null);
        const response = await s3ImageAPI.getProfileImageByKey(userProfilePic);
        setProfilePicUrl(response.data.data.imageUrl);
      } catch (err: any) {
        console.error('Error fetching profile picture URL:', err);
        setError(err.message || 'Failed to load profile picture');
        setProfilePicUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePicUrl();
  }, [userProfilePic]);

  return { profilePicUrl, loading, error };
};
