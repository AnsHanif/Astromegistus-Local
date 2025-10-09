'use client';

import React from 'react';
import { useGetIntroVideos } from '@/hooks/query/intro-videos-queries';

interface ProductBannerSectionProps {
  videoType?: 'welcome' | 'reading' | 'coaching';
}

const ProductBannerSection = ({ videoType = 'welcome' }: ProductBannerSectionProps) => {
  const { data: videosData, isLoading } = useGetIntroVideos();

  const getVideoUrl = () => {
    if (!videosData) return null;
    return videosData.videos[videoType]?.url;
  };

  return (
    <div>
      <div className="relative h-[600px] w-full bg-black">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white">Loading video...</p>
          </div>
        ) : getVideoUrl() ? (
          <video
            src={getVideoUrl()!}
            controls
            className="w-full h-full object-contain"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white">Video not available</p>
          </div>
        )}
      </div>

      <p className="text-base text-center pt-6">
        Meet H.T. - Your Guide to the Stars
      </p>
    </div>
  );
};

export default ProductBannerSection;
