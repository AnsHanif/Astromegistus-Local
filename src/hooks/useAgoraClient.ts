import { useState, useEffect, useRef, useCallback } from 'react';
import { videoCallApi } from '../services/video-call-api';
import {
  checkPermissionStatus,
  getDeviceInfo,
  requestPermissions,
  getBrowserInstructions,
  checkWebRTCSupport,
} from '../utils/permissionUtils';

export interface AgoraUser {
  uid: string | number;
  videoTrack?: any;
  audioTrack?: any;
  hasVideo: boolean;
  hasAudio: boolean;
  isScreen?: boolean;
}

export interface AgoraClientState {
  isConnected: boolean;
  isConnecting: boolean;
  localVideoTrack: any;
  localAudioTrack: any;
  localScreenTrack: any;
  remoteUsers: AgoraUser[];
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  error: string | null;
  previewVideoTrack: any;
  previewAudioTrack: any;
}

export interface AgoraClientActions {
  joinCall: (
    appId: string,
    channelName: string,
    token: string,
    uid: string | number
  ) => Promise<void>;
  leaveCall: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  toggleAudio: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  createPreviewTracks: () => Promise<void>;
  refreshAllVideos: () => void;
}

export const useAgoraClient = (
  videoCallId?: string
): AgoraClientState & AgoraClientActions => {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [localScreenTrack, setLocalScreenTrack] = useState<any>(null);
  const [remoteUsers, setRemoteUsers] = useState<AgoraUser[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const clientRef = useRef<any>(null);
  const previewVideoTrack = useRef<any>(null);
  const previewAudioTrack = useRef<any>(null);

  /**
   * Check if device/browser supports Agora SDK
   */
  const checkAgoraSupport = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
      /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);

    console.log(
      `📱 Device Info: Mobile=${isMobile}, iOS=${isIOS}, Safari=${isSafari}`
    );

    // Check WebRTC support
    const hasWebRTC = !!(
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    );
    const hasRTCPeerConnection = !!(
      window.RTCPeerConnection || (window as any).webkitRTCPeerConnection
    );

    console.log(
      `🌐 WebRTC Support: getUserMedia=${hasWebRTC}, RTCPeerConnection=${hasRTCPeerConnection}`
    );

    return {
      isSupported: hasWebRTC && hasRTCPeerConnection,
      isMobile,
      isIOS,
      isSafari,
    };
  }, []);

  /**
   * Heuristic to detect if a video track is a screen-share track
   */
  const isScreenTrack = useCallback((track: any): boolean => {
    if (!track) return false;

    // Check if track has isScreenTrack property
    if (typeof track.isScreenTrack === 'boolean') {
      console.log('🔍 Track isScreenTrack property:', track.isScreenTrack);
      return track.isScreenTrack;
    }

    let label = '';
    try {
      label =
        typeof track.getTrackLabel === 'function' ? track.getTrackLabel() : '';
      console.log('🔍 Track label:', label);
    } catch {}

    try {
      const mst =
        typeof track.getMediaStreamTrack === 'function'
          ? track.getMediaStreamTrack()
          : undefined;
      if (mst && typeof mst.label === 'string') {
        label = label || mst.label;
        console.log('🔍 MediaStreamTrack label:', mst.label);
      }

      const settings =
        mst && typeof mst.getSettings === 'function'
          ? mst.getSettings()
          : undefined;
      if (settings) {
        console.log('🔍 Track settings:', settings);
        if (typeof settings.displaySurface === 'string') {
          console.log('🔍 Display surface:', settings.displaySurface);
          if (/monitor|window|browser/i.test(settings.displaySurface)) {
            console.log('✅ Screen track detected via displaySurface');
            return true;
          }
        }

        // Check for screen capture constraints
        if (settings.width && settings.height) {
          const aspectRatio = settings.width / settings.height;
          if (aspectRatio > 1.5 && settings.width > 1280) {
            console.log(
              '✅ Screen track detected via dimensions:',
              settings.width,
              'x',
              settings.height
            );
            return true;
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Error checking track settings:', error);
    }

    const isScreenByLabel = /screen|window|tab|display|monitor/i.test(
      label || ''
    );
    console.log('🔍 Screen track by label:', isScreenByLabel, 'label:', label);

    // Additional checks for screen tracks
    const isScreenByConstructor =
      track.constructor.name.includes('Screen') ||
      track.constructor.name.includes('ScreenVideo');
    const isScreenByTrackType = track.getTrackType?.() === 'screen';

    // Check track properties for screen characteristics
    let isScreenByProperties = false;
    try {
      const mst = track.getMediaStreamTrack?.();
      if (mst) {
        const settings = mst.getSettings?.();
        if (settings) {
          // Screen tracks often have specific characteristics
          isScreenByProperties = !!(
            settings.displaySurface ||
            settings.logicalSurface ||
            (settings.width && settings.width >= 1920) || // Screen shares are usually high resolution
            (settings.height && settings.height >= 1080)
          );
        }
      }
    } catch (error) {
      console.warn('⚠️ Error checking track properties:', error);
    }

    console.log('🔍 Additional screen checks:', {
      isScreenByConstructor,
      isScreenByTrackType,
      isScreenByProperties,
      constructorName: track.constructor.name,
      trackType: track.getTrackType?.(),
    });

    // Fallback: Check if this looks like a screen share based on dimensions
    // Screen shares often have non-standard aspect ratios or high resolutions
    let isScreenByDimensions = false;
    try {
      const mst = track.getMediaStreamTrack?.();
      if (mst) {
        const settings = mst.getSettings?.();
        if (settings && settings.width && settings.height) {
          const aspectRatio = settings.width / settings.height;
          // Screen shares often have unusual aspect ratios or high resolutions
          isScreenByDimensions = !!(
            settings.width >= 1200 || // High width
            settings.height >= 600 || // High height
            aspectRatio > 2.0 || // Very wide aspect ratio
            aspectRatio < 0.6 // Very tall aspect ratio
          );
        }
      }
    } catch (error) {
      console.warn('⚠️ Error checking track dimensions:', error);
    }

    const isScreen =
      isScreenByLabel ||
      isScreenByConstructor ||
      isScreenByTrackType ||
      isScreenByProperties ||
      isScreenByDimensions;
    console.log('🔍 Final screen detection result:', isScreen, {
      isScreenByLabel,
      isScreenByConstructor,
      isScreenByTrackType,
      isScreenByProperties,
      isScreenByDimensions,
    });

    return isScreen;
  }, []);

  /**
   * Initialize Agora SDK
   */
  const initializeAgora = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const support = checkAgoraSupport();
      if (!support.isSupported) {
        throw new Error(
          "📱 Your browser doesn't support video calling. Please try Chrome or Firefox."
        );
      }

      console.log('✅ Browser supports WebRTC, loading Agora SDK...');

      if (!clientRef.current) {
        // Dynamic import to avoid SSR issues
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

        const clientConfig = {
          mode: 'rtc' as const,
          codec: support.isMobile ? ('h264' as const) : ('vp8' as const),
        };

        console.log(`🎛️ Creating Agora client with config:`, clientConfig);
        clientRef.current = AgoraRTC.createClient(clientConfig);

        // Add real-time connection monitoring
        clientRef.current.on(
          'connection-state-change',
          (curState: any, revState: any, reason: any) => {
            console.log(
              `🔗 Connection state changed: ${revState} -> ${curState}, reason: ${reason}`
            );
            if (curState === 'CONNECTED') {
              console.log('✅ Real-time connection established');
            } else if (curState === 'DISCONNECTED') {
              console.log('❌ Real-time connection lost');
            }
          }
        );

        // Add network quality monitoring
        clientRef.current.on('network-quality', (stats: any) => {
          console.log(`📊 Network quality:`, stats);
        });

        // Handle remote users
        clientRef.current.on(
          'user-published',
          async (user: any, mediaType: any) => {
            console.log(`🎥 User ${user.uid} published ${mediaType}`);
            console.log('🔍 User published event details:', {
              uid: user.uid,
              mediaType,
              hasVideoTrack: !!user.videoTrack,
              hasAudioTrack: !!user.audioTrack,
              userObject: user,
            });

            try {
              await clientRef.current.subscribe(user, mediaType);
            } catch (error) {
              console.error(`❌ Failed to subscribe to ${user.uid}:`, error);
              return;
            }

            if (mediaType === 'video') {
              console.log('🎥 Processing video track for user:', user.uid);
              console.log('🔍 Remote video track details:', {
                trackLabel: user.videoTrack?.getTrackLabel?.(),
                trackType: user.videoTrack?.getTrackType?.(),
                constructorName: user.videoTrack?.constructor?.name,
                isScreenTrackProperty: (user.videoTrack as any)?.isScreenTrack,
              });
              const isScreen = isScreenTrack(user.videoTrack);
              console.log('🔍 Remote track screen detection result:', isScreen);

              setRemoteUsers((prev) => {
                const existing = prev.find((u) => u.uid === user.uid);
                const isScreenFinal = isScreen;

                if (existing) {
                  return prev.map((u) =>
                    u.uid === user.uid
                      ? {
                          ...u,
                          videoTrack: user.videoTrack,
                          hasVideo: true,
                          isScreen: isScreenFinal,
                        }
                      : u
                  );
                }

                return [
                  ...prev,
                  {
                    uid: user.uid,
                    videoTrack: user.videoTrack,
                    audioTrack: user.audioTrack || null,
                    hasVideo: true,
                    hasAudio: !!user.audioTrack,
                    isScreen: isScreenFinal,
                  },
                ];
              });
            }

            if (mediaType === 'audio') {
              if (user.audioTrack) {
                user.audioTrack.play();
              }

              setRemoteUsers((prev) => {
                const existing = prev.find((u) => u.uid === user.uid);
                if (existing) {
                  return prev.map((u) =>
                    u.uid === user.uid
                      ? {
                          ...u,
                          audioTrack: user.audioTrack,
                          hasAudio: true,
                        }
                      : u
                  );
                }

                return [
                  ...prev,
                  {
                    uid: user.uid,
                    videoTrack: null,
                    audioTrack: user.audioTrack,
                    hasVideo: false,
                    hasAudio: true,
                  },
                ];
              });
            }
          }
        );

        clientRef.current.on(
          'user-unpublished',
          (user: any, mediaType: any) => {
            console.log(`🎥 User ${user.uid} unpublished ${mediaType}`);
            if (mediaType === 'video') {
              setRemoteUsers((prev) =>
                prev.map((u) =>
                  u.uid === user.uid
                    ? { ...u, videoTrack: null, hasVideo: false }
                    : u
                )
              );
            }
            if (mediaType === 'audio') {
              setRemoteUsers((prev) =>
                prev.map((u) =>
                  u.uid === user.uid
                    ? { ...u, audioTrack: null, hasAudio: false }
                    : u
                )
              );
            }
          }
        );

        clientRef.current.on('user-left', (user: any) => {
          console.log('👋 User left:', user.uid);
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });

        // Add a fallback mechanism to detect video tracks
        // Sometimes user-published doesn't fire for video tracks
        clientRef.current.on('user-joined', (user: any) => {
          console.log('👤 User joined:', user.uid);
          // Add user to remote users list
          setRemoteUsers((prev) => {
            const existing = prev.find((u) => u.uid === user.uid);
            if (!existing) {
              return [
                ...prev,
                {
                  uid: user.uid,
                  videoTrack: null,
                  audioTrack: null,
                  hasVideo: false,
                  hasAudio: false,
                  isScreen: false,
                },
              ];
            }
            return prev;
          });
        });

        // Add periodic check for video tracks
        // This is a fallback for when user-published doesn't fire
        const checkForVideoTracks = () => {
          if (clientRef.current) {
            const remoteUsers = clientRef.current.remoteUsers;
            console.log(
              '🔍 Periodic check - Remote users:',
              remoteUsers.length
            );

            remoteUsers.forEach((user: any) => {
              if (user.videoTrack && user.hasVideo) {
                console.log('🔍 Found video track for user:', user.uid);
                console.log('🔍 Video track details:', {
                  trackLabel: user.videoTrack?.getTrackLabel?.(),
                  trackType: user.videoTrack?.getTrackType?.(),
                  constructorName: user.videoTrack?.constructor?.name,
                  isScreenTrackProperty: (user.videoTrack as any)
                    ?.isScreenTrack,
                });
                // Check if this user is already in our state
                setRemoteUsers((prev) => {
                  const existing = prev.find((u) => u.uid === user.uid);
                  console.log('🔍 Existing user state:', existing);
                  console.log(
                    '🔍 Should update?',
                    existing && !existing.hasVideo
                  );

                  if (existing && !existing.hasVideo) {
                    console.log('🔍 Updating user with video track:', user.uid);
                    const isScreen = isScreenTrack(user.videoTrack);
                    console.log('🔍 Screen detection result:', isScreen);
                    return prev.map((u) =>
                      u.uid === user.uid
                        ? {
                            ...u,
                            videoTrack: user.videoTrack,
                            hasVideo: true,
                            isScreen: isScreen,
                          }
                        : u
                    );
                  } else if (existing && existing.hasVideo) {
                    console.log(
                      '🔍 User already has video, checking if screen status changed'
                    );
                    const isScreen = isScreenTrack(user.videoTrack);
                    if (existing.isScreen !== isScreen) {
                      console.log(
                        '🔍 Screen status changed, updating:',
                        isScreen
                      );
                      return prev.map((u) =>
                        u.uid === user.uid
                          ? {
                              ...u,
                              videoTrack: user.videoTrack,
                              isScreen: isScreen,
                            }
                          : u
                      );
                    }
                  } else {
                    // Force update if user exists but conditions don't match
                    console.log(
                      '🔍 Force updating user with video track:',
                      user.uid
                    );
                    const isScreen = isScreenTrack(user.videoTrack);
                    console.log(
                      '🔍 Force update screen detection result:',
                      isScreen
                    );
                    return prev.map((u) =>
                      u.uid === user.uid
                        ? {
                            ...u,
                            videoTrack: user.videoTrack,
                            hasVideo: true,
                            isScreen: isScreen,
                          }
                        : u
                    );
                  }
                  return prev;
                });
              }
            });
          }
        };

        // Check every 2 seconds
        const videoCheckInterval = setInterval(checkForVideoTracks, 2000);

        // Clean up interval on unmount
        return () => {
          clearInterval(videoCheckInterval);
        };
      }

      // Return the AgoraRTC instance for use in other functions
      return (await import('agora-rtc-sdk-ng')).default;
    }
    return null;
  }, [checkAgoraSupport, isScreenTrack]);

  /**
   * Create preview tracks for pre-join modal
   */
  const createPreviewTracks = useCallback(async () => {
    console.log('🔍 createPreviewTracks called');
    try {
      const support = checkAgoraSupport();
      console.log('🔍 Browser support check:', support);
      if (!support.isSupported) {
        throw new Error(
          "Your browser doesn't support video calling. Please try Chrome or Firefox."
        );
      }

      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        setError(
          'Camera and microphone require HTTPS. Please use https:// or localhost.'
        );
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support camera and microphone access.');
        return;
      }

      // Check WebRTC support first
      const webRTCSupport = checkWebRTCSupport();
      if (!webRTCSupport.supported) {
        setError(
          'Your browser does not support video calling. Please use Chrome, Firefox, Safari, or Edge.'
        );
        return;
      }

      // Check device availability
      const deviceInfo = await getDeviceInfo();
      if (!deviceInfo.hasCamera && !deviceInfo.hasMicrophone) {
        setError(
          'No camera or microphone found. Please connect devices and try again.'
        );
        return;
      }

      // Request permissions with better error handling
      const permissionResult = await requestPermissions();
      if (!permissionResult.success) {
        const browserInstructions = getBrowserInstructions();
        const instructions = browserInstructions.instructions.join('\n');

        setError(`${permissionResult.error}\n\n${instructions}`);
        return;
      }

      console.log('✅ Permissions granted successfully');

      // Create preview tracks
      console.log('🔍 Creating Agora tracks...');
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

      try {
        const [audioTrack, videoTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks(
            {
              encoderConfig: 'speech_standard',
              AEC: true,
              AGC: true,
              ANS: true,
            },
            {
              encoderConfig: '480p_1',
              facingMode: 'user',
            }
          );

        console.log('✅ Agora tracks created successfully:', {
          audioTrack: !!audioTrack,
          videoTrack: !!videoTrack,
          videoTrackEnabled: videoTrack?.enabled,
          videoTrackMuted: videoTrack?.muted,
        });

        console.log('🔍 Agora tracks created:', {
          videoTrack: !!videoTrack,
          audioTrack: !!audioTrack,
          videoTrackType: videoTrack?.constructor?.name,
          audioTrackType: audioTrack?.constructor?.name,
        });

        videoTrack.setEnabled(true);
        audioTrack.setEnabled(true);

        // Store tracks in refs
        previewVideoTrack.current = videoTrack;
        previewAudioTrack.current = audioTrack;

        console.log('✅ Preview tracks set successfully');
      } catch (trackError: any) {
        console.error('❌ Failed to create Agora tracks:', trackError);
        setError(
          `Failed to create camera/microphone tracks: ${trackError.message}`
        );
        return;
      }
    } catch (error: any) {
      console.error('❌ Error creating preview tracks:', error);
      if (error.name === 'NotAllowedError') {
        setError(
          'Camera and microphone access denied. Please allow permissions and refresh the page.'
        );
      } else if (error.name === 'NotFoundError') {
        setError(
          'No camera or microphone found. Please connect a camera and microphone.'
        );
      } else {
        setError(
          'Failed to access camera and microphone. Please check your devices and try again.'
        );
      }
    }
  }, [checkAgoraSupport]);

  /**
   * Join the video call
   */
  const joinCall = useCallback(
    async (
      appId: string,
      channelName: string,
      token: string,
      uid: string | number
    ) => {
      try {
        if (isConnecting || isConnected) {
          console.log('Already connecting or connected, ignoring join request');
          return;
        }

        // Validate inputs
        if (!appId || !channelName || !token || !uid) {
          throw new Error('Missing required parameters for joining call');
        }

        setIsConnecting(true);
        setError(null);

        const AgoraRTC = await initializeAgora();
        if (!AgoraRTC) {
          throw new Error('Failed to initialize Agora SDK');
        }

        const support = checkAgoraSupport();
        const isMobile = support.isMobile;

        const audioConfig = {
          encoderConfig: isMobile ? 'speech_low_quality' : 'speech_standard',
          AEC: true,
          AGC: true,
          ANS: true,
        };

        const videoConfig = {
          encoderConfig: isMobile ? '360p_1' : '480p_1',
          optimizationMode: 'motion',
          facingMode: 'user',
          width: isMobile ? 480 : 640,
          height: isMobile ? 360 : 480,
          frameRate: isMobile ? 20 : 30,
        };

        let audioTrack, videoTrack;

        try {
          if (previewAudioTrack.current && previewVideoTrack.current) {
            audioTrack = previewAudioTrack.current;
            videoTrack = previewVideoTrack.current;
          } else {
            const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
            [audioTrack, videoTrack] =
              await AgoraRTC.createMicrophoneAndCameraTracks(
                audioConfig as any,
                videoConfig as any
              );
            // Default to enabled if no preview tracks
            videoTrack.setEnabled(true);
            audioTrack.setEnabled(true);
          }
        } catch (error) {
          console.error('❌ Error creating tracks:', error);
          throw new Error(
            'Failed to access camera and microphone. Please check permissions and try again.'
          );
        }

        setLocalVideoTrack(videoTrack);
        setLocalAudioTrack(audioTrack);

        // Update state to match actual track states
        setIsVideoEnabled(videoTrack.enabled);
        setIsAudioEnabled(audioTrack.enabled);

        // Add a small delay to prevent rapid connection attempts
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Add timeout to prevent hanging
        const joinPromise = clientRef.current.join(
          appId,
          channelName,
          token,
          uid
        );
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Join timeout after 30 seconds')),
            30000
          )
        );

        await Promise.race([joinPromise, timeoutPromise]);

        const tracksToPublish = [];
        if (audioTrack.enabled) tracksToPublish.push(audioTrack);
        if (videoTrack.enabled) tracksToPublish.push(videoTrack);

        if (tracksToPublish.length > 0) {
          await clientRef.current.publish(tracksToPublish);
        }

        setIsConnected(true);
        console.log('Successfully joined video call!');
      } catch (error: any) {
        console.error('❌ Error joining video call:', error);
        let errorMessage = 'Failed to join video call';

        // Handle Agora-specific error codes
        if (error?.code === 'OPERATION_ABORTED') {
          errorMessage =
            'Connection was canceled. This might be due to a token issue or network problem. Please refresh the page and try again.';
        } else if (error?.code === 'INVALID_TOKEN') {
          errorMessage =
            'Invalid token. Please refresh the page to get a new token.';
        } else if (error?.code === 'TOKEN_EXPIRED') {
          errorMessage =
            'Token has expired. Please refresh the page to get a new token.';
        } else if (error?.code === 'INVALID_CHANNEL_NAME') {
          errorMessage =
            'Invalid channel name. Please check the video call link.';
        } else if (error?.code === 'CAN_NOT_GET_GATEWAY_SERVER') {
          errorMessage =
            'Cannot connect to Agora servers. Please check your internet connection and try again.';
        } else if (error?.code === 'CAN_NOT_PUBLISH_MULTIPLE_VIDEO_TRACKS') {
          errorMessage =
            'Cannot publish multiple video tracks. Please stop screen sharing before starting a new one.';
        } else if (error instanceof Error) {
          const message = error.message.toLowerCase();
          if (message.includes('not supported') || message.includes('webrtc')) {
            errorMessage =
              "📱 Your browser doesn't support video calling. Please try:\n• Chrome or Firefox on Android\n• Safari on iOS (latest version)\n• Enable camera/microphone permissions";
          } else if (
            message.includes('permission') ||
            message.includes('camera') ||
            message.includes('microphone')
          ) {
            errorMessage =
              '🎥 Camera/microphone access denied. Please:\n• Allow camera and microphone permissions\n• Refresh the page and try again\n• Check browser settings';
          } else if (
            message.includes('network') ||
            message.includes('connection')
          ) {
            errorMessage =
              '🌐 Network connection issue. Please:\n• Check your internet connection\n• Try switching between WiFi and mobile data\n• Refresh the page';
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
      } finally {
        setIsConnecting(false);
      }
    },
    [
      isConnecting,
      isConnected,
      initializeAgora,
      checkAgoraSupport,
      isAudioEnabled,
      isVideoEnabled,
    ]
  );

  /**
   * Leave the video call
   */
  const leaveCall = useCallback(async () => {
    try {
      if (isScreenSharing) {
        try {
          await toggleScreenShare();
        } catch (e) {
          console.warn('⚠️ Error stopping screen share on leave:', e);
        }
      }

      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }

      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }

      if (localScreenTrack) {
        localScreenTrack.stop();
        localScreenTrack.close();
        setLocalScreenTrack(null);
      }

      if (clientRef.current) {
        await clientRef.current.leave();
      }

      setIsConnected(false);
      setRemoteUsers([]);
      setIsScreenSharing(false);
      console.log('Left video call');
    } catch (error) {
      console.error('Error leaving video call:', error);
    }
  }, [isScreenSharing, localVideoTrack, localAudioTrack, localScreenTrack]);

  /**
   * Toggle video
   */
  const toggleVideo = useCallback(async () => {
    if (localVideoTrack && clientRef.current) {
      try {
        const newVideoState = !isVideoEnabled;

        if (newVideoState) {
          await localVideoTrack.setEnabled(true);
          await clientRef.current.publish([localVideoTrack]);
        } else {
          await clientRef.current.unpublish([localVideoTrack]);
          await localVideoTrack.setEnabled(false);
        }

        setIsVideoEnabled(newVideoState);
      } catch (error) {
        console.error('Error toggling video:', error);
        setError('Failed to toggle video');
      }
    }
  }, [localVideoTrack, isVideoEnabled]);

  /**
   * Toggle audio
   */
  const toggleAudio = useCallback(async () => {
    if (localAudioTrack && clientRef.current) {
      try {
        const newAudioState = !isAudioEnabled;

        if (newAudioState) {
          await localAudioTrack.setEnabled(true);
          await clientRef.current.publish([localAudioTrack]);
        } else {
          await clientRef.current.unpublish([localAudioTrack]);
          await localAudioTrack.setEnabled(false);
        }

        setIsAudioEnabled(newAudioState);
      } catch (error) {
        console.error('Error toggling audio:', error);
        setError('Failed to toggle audio');
      }
    }
  }, [localAudioTrack, isAudioEnabled]);

  /**
   * Update recording layout for screen sharing
   */

  const updateRecordingLayout = useCallback(
    async (isScreenSharing: boolean) => {
      if (!videoCallId) return;

      try {
        // Check if we have enough participants for layout update
        const currentUserUid = clientRef.current?.uid?.toString() || '0';
        const remoteUserUids = remoteUsers.map((user) => user.uid.toString());

        // Silent UID mapping check

        // Fallback: Use client's remote users directly if mapping fails
        let finalRemoteUserUids = remoteUserUids;
        if (
          remoteUserUids.length === 0 &&
          clientRef.current?.remoteUsers?.length > 0
        ) {
          finalRemoteUserUids = clientRef.current.remoteUsers.map((user: any) =>
            user.uid.toString()
          );
        }

        // Additional fallback: Force refresh remote users from client
        if (finalRemoteUserUids.length === 0 && clientRef.current) {
          const clientRemoteUsers = clientRef.current.remoteUsers || [];
          if (clientRemoteUsers.length > 0) {
            finalRemoteUserUids = clientRemoteUsers.map((user: any) =>
              user.uid.toString()
            );
          }
        }

        if (finalRemoteUserUids.length === 0) {
          return;
        }

        // Silent layout update

        // Create layout configuration based on screen sharing state
        const layoutConfig = {
          mixedVideoLayout: 3, // Horizontal layout
          backgroundColor: '#000000',
          layoutConfig: [] as Array<{
            uid: string;
            x_axis: number;
            y_axis: number;
            width: number;
            height: number;
            alpha: number;
            render_mode: number;
          }>,
        };

        if (isScreenSharing) {
          // Screen sharing layout: large screen on left, participants on right
          layoutConfig.layoutConfig = [
            {
              uid: currentUserUid, // Screen share user (current user)
              x_axis: 0.0,
              y_axis: 0.0,
              width: 0.7, // 70% width for screen share
              height: 1.0,
              alpha: 1.0,
              render_mode: 1,
            },
          ];

          // Add remote users to the right side
          if (finalRemoteUserUids.length > 0) {
            finalRemoteUserUids.forEach((uid, index) => {
              layoutConfig.layoutConfig.push({
                uid: uid,
                x_axis: 0.7,
                y_axis: index * (1.0 / finalRemoteUserUids.length),
                width: 0.3, // 30% width for participants
                height: 1.0 / finalRemoteUserUids.length, // Split height among participants
                alpha: 1.0,
                render_mode: 1,
              });
            });
          } else {
            // If no remote users, add a placeholder for the current user's video
            // This will show the current user's camera in the right 30%
            layoutConfig.layoutConfig.push({
              uid: currentUserUid,
              x_axis: 0.7,
              y_axis: 0.0,
              width: 0.3,
              height: 1.0,
              alpha: 1.0,
              render_mode: 1,
            });

            console.log(
              '⚠️ No remote users found, using current user for both positions'
            );
          }
        } else {
          // Normal layout: equal split or grid
          const allUids = [currentUserUid, ...finalRemoteUserUids];
          const userCount = allUids.length;

          allUids.forEach((uid, index) => {
            layoutConfig.layoutConfig.push({
              uid: uid,
              x_axis: index * (1.0 / userCount),
              y_axis: 0.0,
              width: 1.0 / userCount,
              height: 1.0,
              alpha: 1.0,
              render_mode: 1,
            });
          });
        }

        // Silent layout config creation

        try {
          await videoCallApi.updateRecordingLayout(videoCallId, layoutConfig);
          console.log('xxxxx Layout updated');
        } catch (apiError: any) {
          console.error('❌ Layout update failed');
          throw apiError;
        }
      } catch (error) {
        // Silent error handling
      }
    },
    [videoCallId, remoteUsers]
  );

  /**
   * Toggle screen sharing
   */
  const toggleScreenShare = useCallback(async () => {
    if (!clientRef.current) {
      console.error('❌ Client not available for screen sharing');
      return;
    }

    try {
      if (isScreenSharing) {
        await stopScreenShare();
      } else {
        await startScreenShare();
      }
    } catch (error: any) {
      console.error('❌ Error toggling screen share:', error);
    }
  }, [isScreenSharing]);

  const startScreenShare = useCallback(async () => {
    try {
      // Prevent multiple screen sharing attempts
      if (isScreenSharing) {
        console.log('⚠️ Screen sharing already active');
        return;
      }

      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

      const screenTrack = await AgoraRTC.createScreenVideoTrack(
        {
          encoderConfig: '1080p_1',
          optimizationMode: 'detail',
        },
        'disable'
      );

      (screenTrack as any).isScreenTrack = true;
      console.log('✅ Screen track created and marked as screen track');

      // Force unpublish all video tracks first (camera and any existing screen tracks)
      console.log('🔄 Step 1: Force unpublishing all video tracks...');
      await forceUnpublishAllVideoTracks();

      // Disable the local video track
      if (localVideoTrack) {
        console.log('🔄 Step 2: Disabling local video track...');
        await localVideoTrack.setEnabled(false);
        console.log('✅ Local video track disabled');
      }

      // Final check before publishing screen track
      console.log('🔄 Step 3: Final check before publishing screen track...');
      const finalCheckTracks = clientRef.current.localTracks;
      const finalVideoTracks = finalCheckTracks.filter((track: any) => {
        const trackType = track.getTrackType?.();
        const trackLabel = track.getTrackLabel?.();
        const isScreenTrack = track.isScreenTrack;

        // Use multiple methods to identify video tracks
        const isVideoByType = trackType === 'video' || trackType === 'screen';
        const isVideoByLabel =
          trackLabel &&
          (trackLabel.toLowerCase().includes('camera') ||
            trackLabel.toLowerCase().includes('webcam') ||
            trackLabel.toLowerCase().includes('screen') ||
            trackLabel.toLowerCase().includes('display'));
        const isVideoByConstructor =
          track.constructor.name.includes('Video') ||
          track.constructor.name.includes('Screen');
        const isVideoByScreenFlag = isScreenTrack === true;

        return (
          isVideoByType ||
          isVideoByLabel ||
          isVideoByConstructor ||
          isVideoByScreenFlag
        );
      });
      console.log(
        `🔍 Final check - Local video tracks still published: ${finalVideoTracks.length}`
      );

      // Also check remote users for any video tracks
      console.log(
        `🔍 Remote users with video tracks: ${remoteUsers.filter((user) => user.videoTrack).length}`
      );

      // Log all remote users and their tracks
      remoteUsers.forEach((user, index) => {
        console.log(`👤 Remote User ${index}:`, {
          uid: user.uid,
          hasVideo: !!user.videoTrack,
          hasAudio: !!user.audioTrack,
          videoTrackType: user.videoTrack?.getTrackType?.(),
          videoTrackLabel: user.videoTrack?.getTrackLabel?.(),
        });
      });

      if (finalVideoTracks.length > 0) {
        console.error(
          '❌ CRITICAL: Video tracks still published before screen share!'
        );
        finalVideoTracks.forEach((track: any, index: number) => {
          console.error(`❌ Track ${index}:`, {
            type: track.getTrackType?.(),
            label: track.getTrackLabel?.(),
            isScreenTrack: track.isScreenTrack,
          });
        });
        throw new Error(
          'Cannot start screen share: video tracks still published'
        );
      }

      // Additional safety check - wait a bit more
      console.log('🔄 Step 3.5: Additional safety wait...');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // One more final check after the wait
      const ultraFinalCheck = clientRef.current.localTracks;
      const ultraFinalVideoTracks = ultraFinalCheck.filter((track: any) => {
        const trackType = track.getTrackType?.();
        const trackLabel = track.getTrackLabel?.();
        const isScreenTrack = track.isScreenTrack;

        // Use multiple methods to identify video tracks
        const isVideoByType = trackType === 'video' || trackType === 'screen';
        const isVideoByLabel =
          trackLabel &&
          (trackLabel.toLowerCase().includes('camera') ||
            trackLabel.toLowerCase().includes('webcam') ||
            trackLabel.toLowerCase().includes('screen') ||
            trackLabel.toLowerCase().includes('display'));
        const isVideoByConstructor =
          track.constructor.name.includes('Video') ||
          track.constructor.name.includes('Screen');
        const isVideoByScreenFlag = isScreenTrack === true;

        return (
          isVideoByType ||
          isVideoByLabel ||
          isVideoByConstructor ||
          isVideoByScreenFlag
        );
      });
      console.log(
        `🔍 Ultra final check - Video tracks: ${ultraFinalVideoTracks.length}`
      );

      if (ultraFinalVideoTracks.length > 0) {
        console.error(
          '❌ ULTRA CRITICAL: Video tracks still exist after all attempts!'
        );
        ultraFinalVideoTracks.forEach((track: any, index: number) => {
          console.error(`❌ Ultra Final Track ${index}:`, {
            type: track.getTrackType?.(),
            label: track.getTrackLabel?.(),
            isScreenTrack: track.isScreenTrack,
            trackId: track.trackId || 'no-id',
          });
        });
        throw new Error(
          'Cannot start screen share: video tracks still exist after all attempts'
        );
      }

      // Now publish the screen track
      console.log('📤 Step 4: Publishing screen track...');

      // Try a different approach - check if we can publish without error
      try {
        await clientRef.current.publish(screenTrack);
        console.log('✅ Screen track published successfully');
      } catch (publishError: any) {
        console.error('❌ Screen track publish failed:', publishError);

        if (publishError?.code === 'CAN_NOT_PUBLISH_MULTIPLE_VIDEO_TRACKS') {
          console.log(
            '🔄 Attempting alternative approach - checking all tracks...'
          );

          // Log the complete state of the client
          console.log('🔍 Complete client state:');
          console.log('- Local tracks:', clientRef.current.localTracks.length);
          console.log('- Remote users:', remoteUsers.length);
          console.log('- Is connected:', clientRef.current.connectionState);

          // Try to get more detailed information about what's published
          const allTracks = clientRef.current.localTracks;
          console.log('🔍 All local tracks details:');
          allTracks.forEach((track: any, index: number) => {
            console.log(`Track ${index}:`, {
              type: track.getTrackType?.(),
              label: track.getTrackLabel?.(),
              enabled: track.enabled,
              isScreenTrack: track.isScreenTrack,
              trackId: track.trackId || 'no-id',
              published: true, // All local tracks are published
            });
          });

          // Check if there are any remote video tracks that might be causing issues
          console.log('🔍 Remote video tracks:');
          remoteUsers.forEach((user, index) => {
            if (user.videoTrack) {
              console.log(`Remote User ${index} video track:`, {
                uid: user.uid,
                type: user.videoTrack.getTrackType?.(),
                label: user.videoTrack.getTrackLabel?.(),
                enabled: user.videoTrack.enabled,
              });
            }
          });

          throw new Error(
            `Screen share failed: ${publishError.message}. Check console for detailed track information.`
          );
        } else {
          throw publishError;
        }
      }

      setLocalScreenTrack(screenTrack);
      setIsScreenSharing(true);

      // Wait for state to update before calling layout update
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update recording layout for screen sharing
      await updateRecordingLayout(true);

      // Debug: Test if the screen track is properly identified
      const isScreenDetected = isScreenTrack(screenTrack);
      console.log('🔍 Screen track detection test:', {
        isScreenDetected,
        trackLabel: screenTrack.getTrackLabel?.(),
        isScreenTrackProperty: (screenTrack as any).isScreenTrack,
      });

      screenTrack.on('track-ended', async () => {
        console.log('📺 Screen share track ended by user');
        await stopScreenShare();
      });
    } catch (error: any) {
      console.error('❌ Error starting screen share:', error);
      setIsScreenSharing(false);
      setLocalScreenTrack(null);

      // If screen sharing fails, try to republish the camera track
      if (localVideoTrack && clientRef.current && isVideoEnabled) {
        try {
          await clientRef.current.publish(localVideoTrack);
          console.log('✅ Camera track republished after screen share failure');
        } catch (republishError) {
          console.error('❌ Error republishing camera track:', republishError);
        }
      }
    }
  }, [localVideoTrack, isVideoEnabled]);

  const stopScreenShare = useCallback(async () => {
    try {
      console.log('🛑 Stopping screen share...');

      // Unpublish all video tracks first (screen and any other video tracks)
      await unpublishAllVideoTracks();

      // Clean up the screen track
      if (localScreenTrack) {
        try {
          localScreenTrack.stop();
          localScreenTrack.close();
          console.log('✅ Screen track cleaned up');
        } catch (error) {
          console.warn('⚠️ Error cleaning up screen track:', error);
        }
        setLocalScreenTrack(null);
      }

      // Then republish the camera track if video is enabled
      if (localVideoTrack && clientRef.current && isVideoEnabled) {
        try {
          // Check if camera track is already published
          const publishedTracks = clientRef.current.localTracks;
          const isCameraTrackPublished = publishedTracks.some(
            (track: any) => track === localVideoTrack
          );

          if (!isCameraTrackPublished) {
            console.log('📤 Republishing camera track...');
            await localVideoTrack.setEnabled(true);
            await clientRef.current.publish(localVideoTrack);
            console.log(
              '✅ Camera track republished after stopping screen share'
            );
          } else {
            console.log('ℹ️ Camera track already published');
            await localVideoTrack.setEnabled(true);
          }
        } catch (republishError) {
          console.error('❌ Error republishing camera track:', republishError);
        }
      }

      setIsScreenSharing(false);

      // Update recording layout for normal view
      await updateRecordingLayout(false);

      console.log('✅ Screen share stopped successfully');
    } catch (error: any) {
      console.error('❌ Error stopping screen share:', error);
    }
  }, [localScreenTrack, localVideoTrack, isVideoEnabled]);

  /**
   * Helper function to unpublish all video tracks
   */
  const unpublishAllVideoTracks = useCallback(async () => {
    if (!clientRef.current) return;

    try {
      const publishedTracks = clientRef.current.localTracks;
      console.log('🔍 Current published tracks:', publishedTracks.length);

      // Log all track details
      publishedTracks.forEach((track: any, index: number) => {
        const trackType = track.getTrackType?.();
        const trackLabel = track.getTrackLabel?.();
        const isEnabled = track.enabled;
        console.log(`📊 Track ${index}:`, {
          type: trackType,
          label: trackLabel,
          enabled: isEnabled,
          isScreenTrack: track.isScreenTrack,
        });
      });

      const videoTracks = publishedTracks.filter((track: any) => {
        const trackType = track.getTrackType?.();
        const trackLabel = track.getTrackLabel?.();
        const isScreenTrack = track.isScreenTrack;

        // Use multiple methods to identify video tracks
        const isVideoByType = trackType === 'video' || trackType === 'screen';
        const isVideoByLabel =
          trackLabel &&
          (trackLabel.toLowerCase().includes('camera') ||
            trackLabel.toLowerCase().includes('webcam') ||
            trackLabel.toLowerCase().includes('screen') ||
            trackLabel.toLowerCase().includes('display'));
        const isVideoByConstructor =
          track.constructor.name.includes('Video') ||
          track.constructor.name.includes('Screen');
        const isVideoByScreenFlag = isScreenTrack === true;

        return (
          isVideoByType ||
          isVideoByLabel ||
          isVideoByConstructor ||
          isVideoByScreenFlag
        );
      });

      console.log(`🎥 Found ${videoTracks.length} video track(s) to unpublish`);

      if (videoTracks.length > 0) {
        console.log(`📤 Unpublishing ${videoTracks.length} video track(s)...`);
        for (const track of videoTracks) {
          try {
            console.log(`📤 Unpublishing track:`, {
              type: track.getTrackType?.(),
              label: track.getTrackLabel?.(),
              isScreenTrack: track.isScreenTrack,
            });
            await clientRef.current.unpublish(track);
            console.log(
              '✅ Unpublished video track:',
              (track as any).getTrackLabel?.()
            );
          } catch (error) {
            console.warn('⚠️ Error unpublishing video track:', error);
          }
        }
        // Wait for unpublishing to complete
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Double-check after unpublishing
        const remainingTracks = clientRef.current.localTracks;
        const remainingVideoTracks = remainingTracks.filter((track: any) => {
          const trackType = track.getTrackType?.();
          const trackLabel = track.getTrackLabel?.();
          const isScreenTrack = track.isScreenTrack;

          // Use multiple methods to identify video tracks
          const isVideoByType = trackType === 'video' || trackType === 'screen';
          const isVideoByLabel =
            trackLabel &&
            (trackLabel.toLowerCase().includes('camera') ||
              trackLabel.toLowerCase().includes('webcam') ||
              trackLabel.toLowerCase().includes('screen') ||
              trackLabel.toLowerCase().includes('display'));
          const isVideoByConstructor =
            track.constructor.name.includes('Video') ||
            track.constructor.name.includes('Screen');
          const isVideoByScreenFlag = isScreenTrack === true;

          return (
            isVideoByType ||
            isVideoByLabel ||
            isVideoByConstructor ||
            isVideoByScreenFlag
          );
        });
        console.log(
          `🔍 Remaining video tracks after unpublishing: ${remainingVideoTracks.length}`
        );
      } else {
        console.log('ℹ️ No video tracks found to unpublish');
      }
    } catch (error) {
      console.error('❌ Error unpublishing video tracks:', error);
    }
  }, []);

  /**
   * Force unpublish all video tracks with retries
   */
  const forceUnpublishAllVideoTracks = useCallback(async () => {
    if (!clientRef.current) return;

    let attempts = 0;
    const maxAttempts = 5; // Increased attempts

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`🔄 Force unpublish attempt ${attempts}/${maxAttempts}`);

      try {
        const publishedTracks = clientRef.current.localTracks;
        console.log(`🔍 Total local tracks: ${publishedTracks.length}`);

        // Log all tracks first
        publishedTracks.forEach((track: any, index: number) => {
          console.log(`📊 Local Track ${index}:`, {
            type: track.getTrackType?.(),
            label: track.getTrackLabel?.(),
            enabled: track.enabled,
            isScreenTrack: track.isScreenTrack,
            trackId: track.trackId || 'no-id',
          });
        });

        const videoTracks = publishedTracks.filter((track: any) => {
          const trackType = track.getTrackType?.();
          const trackLabel = track.getTrackLabel?.();
          const isScreenTrack = track.isScreenTrack;

          // Use multiple methods to identify video tracks
          const isVideoByType = trackType === 'video' || trackType === 'screen';
          const isVideoByLabel =
            trackLabel &&
            (trackLabel.toLowerCase().includes('camera') ||
              trackLabel.toLowerCase().includes('webcam') ||
              trackLabel.toLowerCase().includes('screen') ||
              trackLabel.toLowerCase().includes('display'));
          const isVideoByConstructor =
            track.constructor.name.includes('Video') ||
            track.constructor.name.includes('Screen');
          const isVideoByScreenFlag = isScreenTrack === true;

          const isVideo =
            isVideoByType ||
            isVideoByLabel ||
            isVideoByConstructor ||
            isVideoByScreenFlag;

          console.log(
            `🎯 Track ${trackLabel}: type=${trackType}, constructor=${track.constructor.name}, isScreenTrack=${isScreenTrack}, isVideo=${isVideo}`
          );
          console.log(
            `   - By type: ${isVideoByType}, By label: ${isVideoByLabel}, By constructor: ${isVideoByConstructor}, By screen flag: ${isVideoByScreenFlag}`
          );

          return isVideo;
        });

        if (videoTracks.length === 0) {
          console.log('✅ No video tracks found, unpublishing complete');
          break;
        }

        console.log(
          `📤 Force unpublishing ${videoTracks.length} video track(s)...`
        );

        // Unpublish all video tracks sequentially (not parallel) to avoid race conditions
        for (const track of videoTracks) {
          try {
            console.log(`📤 Force unpublishing:`, {
              type: track.getTrackType?.(),
              label: track.getTrackLabel?.(),
              isScreenTrack: track.isScreenTrack,
              trackId: track.trackId || 'no-id',
            });

            // First disable the track
            if (track.setEnabled) {
              await track.setEnabled(false);
              console.log(`🔇 Disabled track: ${track.getTrackLabel?.()}`);
            }

            // Then unpublish
            await clientRef.current.unpublish(track);
            console.log(
              '✅ Force unpublished:',
              (track as any).getTrackLabel?.()
            );

            // Wait a bit between each unpublish
            await new Promise((resolve) => setTimeout(resolve, 200));
          } catch (error) {
            console.warn('⚠️ Error force unpublishing track:', error);
          }
        }

        // Wait longer for unpublishing to complete
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Check if any video tracks remain
        const remainingTracks = clientRef.current.localTracks;
        const remainingVideoTracks = remainingTracks.filter((track: any) => {
          const trackType = track.getTrackType?.();
          const trackLabel = track.getTrackLabel?.();
          const isScreenTrack = track.isScreenTrack;

          // Use multiple methods to identify video tracks
          const isVideoByType = trackType === 'video' || trackType === 'screen';
          const isVideoByLabel =
            trackLabel &&
            (trackLabel.toLowerCase().includes('camera') ||
              trackLabel.toLowerCase().includes('webcam') ||
              trackLabel.toLowerCase().includes('screen') ||
              trackLabel.toLowerCase().includes('display'));
          const isVideoByConstructor =
            track.constructor.name.includes('Video') ||
            track.constructor.name.includes('Screen');
          const isVideoByScreenFlag = isScreenTrack === true;

          return (
            isVideoByType ||
            isVideoByLabel ||
            isVideoByConstructor ||
            isVideoByScreenFlag
          );
        });

        console.log(
          `🔍 After attempt ${attempts}: ${remainingVideoTracks.length} video tracks remaining`
        );

        // Log remaining tracks
        remainingVideoTracks.forEach((track: any, index: number) => {
          console.log(`❌ Remaining Track ${index}:`, {
            type: track.getTrackType?.(),
            label: track.getTrackLabel?.(),
            enabled: track.enabled,
            isScreenTrack: track.isScreenTrack,
            trackId: track.trackId || 'no-id',
          });
        });

        if (remainingVideoTracks.length === 0) {
          console.log('✅ All video tracks successfully unpublished');
          break;
        }

        if (attempts === maxAttempts) {
          console.error(
            '❌ Failed to unpublish all video tracks after maximum attempts'
          );
          console.error(
            '❌ Remaining tracks:',
            remainingVideoTracks.map((t: any) => ({
              type: t.getTrackType?.(),
              label: t.getTrackLabel?.(),
              trackId: t.trackId || 'no-id',
            }))
          );
          throw new Error('Failed to unpublish all video tracks');
        }
      } catch (error) {
        console.error(
          `❌ Error in force unpublish attempt ${attempts}:`,
          error
        );
        if (attempts === maxAttempts) {
          throw error;
        }
      }
    }
  }, []);

  /**
   * Refresh all videos
   */
  const refreshAllVideos = useCallback(() => {
    console.log('Refreshing all videos...');
    setRemoteUsers((prev) => [...prev]);
  }, []);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up Agora client on unmount...');
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localScreenTrack) {
        localScreenTrack.stop();
        localScreenTrack.close();
      }
      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, []); // Empty dependency array - only run on unmount

  return {
    // State
    isConnected,
    isConnecting,
    localVideoTrack,
    localAudioTrack,
    localScreenTrack,
    remoteUsers,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    error,
    previewVideoTrack: previewVideoTrack.current,
    previewAudioTrack: previewAudioTrack.current,
    // Actions
    joinCall,
    leaveCall,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    createPreviewTracks,
    refreshAllVideos,
  };
};
