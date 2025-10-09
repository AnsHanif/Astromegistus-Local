'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useProfilePictureUrl } from '../../hooks/useProfilePictureUrl';

// SVG icons as image sources
const MIC_ICON = '/svg/mic.svg';
const MIC_OFF_ICON = '/svg/mic-off.svg';
const VIDEO_CALL_ICON = '/svg/video-call.svg';
const VIDEO_CALL_OFF_ICON = '/svg/video-call-off.svg';

interface VideoPlayerProps {
  videoTrack?: any;
  audioTrack?: any;
  isEnabled: boolean;
  isLocal?: boolean;
  isScreen?: boolean;
  userName: string;
  userProfilePic?: string;
  className?: string;
  showNameBadge?: boolean;
  showScreenShareLabel?: boolean;
  isPreview?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoTrack,
  audioTrack,
  isEnabled,
  isLocal = false,
  isScreen = false,
  userName,
  userProfilePic,
  className = '',
  showNameBadge = true,
  showScreenShareLabel = false,
  isPreview = false,
  hasAudio = true,
  hasVideo = true,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const {
    profilePicUrl,
    loading: profilePicLoading,
    error: profilePicError,
  } = useProfilePictureUrl(userProfilePic);

  // Play video track when available
  useEffect(() => {
    let isPlaying = false;
    let playTimeout: NodeJS.Timeout | null = null;

    const playVideo = async () => {
      // Prevent multiple simultaneous play requests
      if (isPlaying) {
        console.log('⚠️ Video play already in progress, skipping...');
        return;
      }
      console.log('🔍 VideoPlayer playVideo called:', {
        hasVideoRef: !!videoRef.current,
        hasVideoTrack: !!videoTrack,
        isEnabled,
        isPreview,
        userName,
        videoTrackType: videoTrack?.constructor?.name,
        videoTrackEnabled: videoTrack?.enabled,
        videoTrackMuted: videoTrack?.muted,
        videoTrackId: videoTrack?.getTrackId?.(),
      });

      if (!videoRef.current || !videoTrack || !isEnabled) {
        console.log('🔍 VideoPlayer playVideo skipped:', {
          reason: !videoRef.current
            ? 'no videoRef'
            : !videoTrack
              ? 'no videoTrack'
              : 'not enabled',
        });
        isPlaying = false;
        return;
      }

      isPlaying = true;

      try {
        // Clear any existing content
        videoRef.current.innerHTML = '';

        // Wait a bit for the DOM to be ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log('xxxxx About to play video track in VideoPlayer');
        console.log('xxxxx Video track details before play:', {
          trackId: videoTrack.getTrackId?.(),
          enabled: videoTrack.enabled,
          muted: videoTrack.muted,
          trackLabel: videoTrack.getTrackLabel?.(),
          trackType: videoTrack.getTrackType?.(),
        });

        // Play the video track with error handling
        try {
          await videoTrack.play(videoRef.current);
          console.log('🔍 Video track played successfully');
        } catch (playError: any) {
          if (playError.name === 'AbortError') {
            console.log('⚠️ Video play was aborted, retrying...');
            // Wait a bit and retry
            await new Promise((resolve) => setTimeout(resolve, 200));
            try {
              await videoTrack.play(videoRef.current);
              console.log('🔍 Video track played successfully on retry');
            } catch (retryError) {
              console.error('❌ Video play failed on retry:', retryError);
            }
          } else {
            console.error('❌ Video play error:', playError);
          }
        } finally {
          isPlaying = false;
        }

        // Style the video element
        const styleVideoElement = () => {
          const videoElement = videoRef.current?.querySelector('video');
          if (videoElement) {
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            videoElement.style.borderRadius = '8px';
            videoElement.style.backgroundColor = 'transparent';
            videoElement.style.display = 'block';
            videoElement.style.visibility = 'visible';
            videoElement.style.opacity = '1';
            videoElement.style.position = 'absolute';
            videoElement.style.top = '0';
            videoElement.style.left = '0';
            videoElement.style.zIndex = '1';

            console.log('xxxxx Video element styled successfully:', {
              videoWidth: videoElement.videoWidth,
              videoHeight: videoElement.videoHeight,
              readyState: videoElement.readyState,
              paused: videoElement.paused,
              muted: videoElement.muted,
              srcObject: !!videoElement.srcObject,
              currentTime: videoElement.currentTime,
            });
            return true;
          }
          return false;
        };

        // Try styling immediately and then retry
        if (!styleVideoElement()) {
          setTimeout(() => {
            if (!styleVideoElement()) {
              setTimeout(() => {
                styleVideoElement();
              }, 1000);
            }
          }, 500);
        }
      } catch (error) {
        console.error('❌ Error playing video track:', error);
        // Retry with exponential backoff
        setTimeout(() => {
          if (videoRef.current && videoTrack) {
            videoTrack.play(videoRef.current).catch((retryError: any) => {
              console.error('❌ Error in retry playing video:', retryError);
            });
          }
        }, 1000);
      }
    };

    if (videoTrack && isEnabled) {
      // Clear any existing timeout
      if (playTimeout) {
        clearTimeout(playTimeout);
      }

      // Debounce play requests
      playTimeout = setTimeout(() => {
        playVideo();
      }, 100);
    }

    // Cleanup
    return () => {
      if (playTimeout) {
        clearTimeout(playTimeout);
      }
      isPlaying = false;
    };
  }, [videoTrack, isEnabled]);

  // Play audio track when available
  useEffect(() => {
    if (audioTrack && !isLocal) {
      try {
        audioTrack.play();
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('⚠️ Audio play was aborted, retrying...');
          setTimeout(() => {
            try {
              audioTrack.play();
            } catch (retryError) {
              console.error('❌ Audio play failed on retry:', retryError);
            }
          }, 200);
        } else {
          console.error('❌ Audio play error:', error);
        }
      }
    }
  }, [audioTrack, isLocal]);

  // Generate user initials
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Video Container */}
      <div ref={videoRef} className="w-full h-full bg-charcoal/50" />

      {/* Camera Off Overlay */}
      {!isEnabled && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-charcoal/80 to-graphite/80 backdrop-blur-sm ${isPreview ? 'z-10' : 'z-10'}`}
        >
          {(() => {
            console.log('🔍 Camera off overlay showing for:', {
              userName,
              userProfilePic,
              isLocal,
              isEnabled,
              isScreen,
            });
            return null;
          })()}
          <div className="text-center p-6">
            {userProfilePic ? (
              <div className="relative">
                {profilePicLoading ? (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark flex items-center justify-center mx-auto mb-4 border-4 border-golden-glow shadow-2xl animate-pulse">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt={`${userName} Profile`}
                    className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-golden-glow shadow-2xl"
                    onError={() => {
                      console.error(
                        'Failed to load profile picture:',
                        profilePicUrl
                      );
                    }}
                  />
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-golden-glow shadow-2xl">
                    <span className="text-white text-2xl font-bold">
                      {getUserInitials(userName)}
                    </span>
                  </div>
                )}
                {/* Camera off indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                  <span className="text-white text-2xl font-bold">
                    {getUserInitials(userName)}
                  </span>
                </div>
                {/* Camera off indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark rounded-full flex items-center justify-center border-2 border-white">
                  <Image
                    src={VIDEO_CALL_OFF_ICON}
                    alt="Video off"
                    width={24}
                    height={24}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            )}
            <h3 className="text-white text-xl font-semibold mb-2">
              {userName}
            </h3>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-soft-cream text-sm font-medium">
                {isScreen ? 'Screen sharing' : 'Camera off'}
              </p>
            </div>
            {isLocal && (
              <p className="text-golden-glow text-xs font-medium">You</p>
            )}
          </div>
        </div>
      )}

      {/* Name Badge - Google Meet Style */}
      {showNameBadge && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/90 rounded text-white text-xs font-medium border border-white/30 backdrop-blur-sm z-30 shadow-lg">
          {userName}
          {isLocal && <span className="text-golden-glow ml-1">(You)</span>}
          {showScreenShareLabel && isScreen && (
            <span className="text-golden-glow ml-1">(Screen)</span>
          )}
        </div>
      )}

      {/* Audio/Video Status Icons - Google Meet Style */}
      <div className="absolute bottom-2 right-2 flex gap-1 z-20">
        {/* Video Status */}
        {hasVideo ? (
          <div className="w-6 h-6 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark rounded-full flex items-center justify-center border border-white/30">
            <Image
              src={VIDEO_CALL_ICON}
              alt="Video on"
              width={24}
              height={24}
              className="w-3 h-3"
            />
          </div>
        ) : (
          <div className="w-6 h-6 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark rounded-full flex items-center justify-center border border-white/30">
            <Image
              src={VIDEO_CALL_OFF_ICON}
              alt="Video off"
              width={24}
              height={24}
              className="w-3 h-3"
            />
          </div>
        )}

        {/* Audio Status */}
        {hasAudio ? (
          <div className="w-6 h-6 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark rounded-full flex items-center justify-center border border-white/30">
            <Image
              src={MIC_ICON}
              alt="Audio on"
              width={24}
              height={24}
              className="w-3 h-3"
            />
          </div>
        ) : (
          <div className="w-6 h-6 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark rounded-full flex items-center justify-center border border-white/30">
            <Image
              src={MIC_OFF_ICON}
              alt="Audio off"
              width={24}
              height={24}
              className="w-3 h-3"
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface ScreenSharePlayerProps {
  screenTrack?: any;
  isLocal?: boolean;
  className?: string;
}

export const ScreenSharePlayer: React.FC<ScreenSharePlayerProps> = ({
  screenTrack,
  isLocal = false,
  className = '',
}) => {
  const screenRef = useRef<HTMLDivElement>(null);

  // Debug screen track
  console.log('🔍 ScreenSharePlayer received:', {
    screenTrack: !!screenTrack,
    isLocal,
    trackLabel: screenTrack?.getTrackLabel?.(),
    trackType: screenTrack?.getTrackType?.(),
  });

  // Play screen track when available
  useEffect(() => {
    const playScreen = async () => {
      if (!screenRef.current || !screenTrack) {
        console.log('🔍 ScreenSharePlayer: No screen track or ref');
        return;
      }

      try {
        screenRef.current.innerHTML = '';
        await screenTrack.play(screenRef.current);

        // Style the video element
        const videoElement = screenRef.current.querySelector('video');
        if (videoElement) {
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'cover';
          videoElement.style.borderRadius = '8px';
        }
      } catch (error) {
        console.warn('⚠️ Failed to play screen track', error);
      }
    };

    if (screenTrack) {
      playScreen();
    }
  }, [screenTrack]);

  return (
    <div ref={screenRef} className={`w-full h-full bg-black/60 ${className}`} />
  );
};

interface WaitingForParticipantsProps {
  className?: string;
}

export const WaitingForParticipants: React.FC<WaitingForParticipantsProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-charcoal/50 rounded-lg ${className}`}
    >
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-semibold">
          👥
        </div>
        <p className="text-white text-xl font-medium">
          Waiting for participants...
        </p>
        <p className="text-soft-cream text-sm">
          Share the call link to invite others
        </p>
      </div>
    </div>
  );
};
