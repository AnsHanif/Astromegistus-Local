'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import VideoCall to avoid SSR issues
const VideoCall = dynamic(
  () =>
    import('@/components/video-call/VideoCall').then((mod) => ({
      default: mod.VideoCall,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-green via-charcoal to-graphite">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden-glow mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading video call...</p>
        </div>
      </div>
    ),
  }
);

/**
 * Video Call Room - Main page component
 */
export default function VideoCallRoom() {
  const params = useParams();
  const videoCallId = params.videoCallId as string;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!videoCallId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Video Call
          </h1>
          <p className="text-gray-600">Video call ID is required</p>
        </div>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-green via-charcoal to-graphite">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden-glow mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading video call...</p>
        </div>
      </div>
    );
  }

  return <VideoCall videoCallId={videoCallId} />;
}
