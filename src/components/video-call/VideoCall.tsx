'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Image from 'next/image';
import { logo } from '@/components/assets';
import { useAgoraClient } from '@/hooks/useAgoraClient';
import {
  useVideoCallDetails,
  useAgoraToken,
  useRecordingStatus,
  useStartRecording,
  useStopRecording,
} from '@/api/recording';
import {
  useStartTranscription,
  useStopTranscription,
  useTranscriptionStatus,
} from '@/api/transcription';
import { useQueryClient } from '@tanstack/react-query';
import {
  VideoPlayer,
  ScreenSharePlayer,
  WaitingForParticipants,
} from './VideoPlayer';
import { Controls, PreJoinControls } from './Controls';
import { VideoCallService } from '@/services/videoCallService';
import { PermissionTroubleshooting } from './PermissionTroubleshooting';

interface VideoCallProps {
  videoCallId: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ videoCallId }) => {
  const [isClient, setIsClient] = useState(false);
  const userInfo = useSelector((state: RootState) => state.user.currentUser);
  const token = useSelector((state: RootState) => state.user.token);
  const queryClient = useQueryClient();

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Agora client state and actions
  const {
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
    previewVideoTrack,
    previewAudioTrack,
    joinCall,
    leaveCall,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    createPreviewTracks,
  } = useAgoraClient(videoCallId);

  // API queries
  const { data: videoCallDetails, isLoading: isLoadingDetails } =
    useVideoCallDetails(videoCallId);
  const { data: tokenData, isLoading: isLoadingToken } =
    useAgoraToken(videoCallId);
  const { data: recordingStatus, refetch: refetchRecordingStatus } =
    useRecordingStatus(videoCallId);
  const startRecordingMutation = useStartRecording();
  const stopRecordingMutation = useStopRecording();

  // Transcription mutations
  const startTranscriptionMutation = useStartTranscription();
  const stopTranscriptionMutation = useStopTranscription();
  const { data: transcriptionStatus } = useTranscriptionStatus(
    videoCallDetails?.channelName || null
  );

  // Local state
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [previewVideoEnabled, setPreviewVideoEnabled] = useState(true);
  const [previewAudioEnabled, setPreviewAudioEnabled] = useState(true);
  const [userRole, setUserRole] = useState<'astro' | 'user' | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(
    null
  );
  const [callEnded, setCallEnded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isScreenShareLoading, setIsScreenShareLoading] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [transcriptionAgentId, setTranscriptionAgentId] = useState<
    string | null
  >(null);

  // UID to user mapping
  const [uidToUserMap, setUidToUserMap] = useState<
    Map<string, { name: string; profilePic?: string }>
  >(new Map());

  // Build UID mapping when video call details are loaded
  useEffect(() => {
    if (videoCallDetails && tokenData) {
      const newMap = new Map<string, { name: string; profilePic?: string }>();

      console.log('🔍 Building UID mapping with video call details:', {
        hostUser: videoCallDetails.hostUser,
        astrologer: videoCallDetails.astrologer,
        client: videoCallDetails.client,
        participants: videoCallDetails.participants,
        currentUserInfo: userInfo,
        tokenUid: tokenData.uid,
      });

      console.log('🔍 Current user info details:', {
        userInfoId: userInfo?.id,
        userInfoName: userInfo?.name,
        userInfoEmail: userInfo?.email,
        tokenUid: tokenData.uid,
        tokenUidType: typeof tokenData.uid,
      });

      // Add current user (local) mapping - this is the user who is currently viewing
      if (tokenData.uid) {
        newMap.set(tokenData.uid.toString(), {
          name: getCurrentUserName(),
          profilePic: getCurrentUserProfilePic(),
        });
      }

      // Add host user mapping - try multiple UID formats
      if (videoCallDetails.hostUser?.id) {
        newMap.set(videoCallDetails.hostUser.id, {
          name: videoCallDetails.hostUser.name,
          profilePic: videoCallDetails.hostUser.profilePic,
        });
        // Also try with the host user ID as a number if it's numeric
        const hostIdNum = parseInt(videoCallDetails.hostUser.id);
        if (!isNaN(hostIdNum)) {
          newMap.set(hostIdNum.toString(), {
            name: videoCallDetails.hostUser.name,
            profilePic: videoCallDetails.hostUser.profilePic,
          });
        }
      }

      // Add astrologer user mapping (if different from host)
      if (
        videoCallDetails.astrologer?.id &&
        videoCallDetails.astrologer.id !== videoCallDetails.hostUser?.id
      ) {
        newMap.set(videoCallDetails.astrologer.id, {
          name: videoCallDetails.astrologer.name,
          profilePic: videoCallDetails.astrologer.profilePic,
        });
        // Also try with the astrologer ID as a number if it's numeric
        const astroIdNum = parseInt(videoCallDetails.astrologer.id);
        if (!isNaN(astroIdNum)) {
          newMap.set(astroIdNum.toString(), {
            name: videoCallDetails.astrologer.name,
            profilePic: videoCallDetails.astrologer.profilePic,
          });
        }
      }

      // Add client user mapping (if different from host and astrologer)
      if (
        videoCallDetails.client?.id &&
        videoCallDetails.client.id !== videoCallDetails.hostUser?.id &&
        videoCallDetails.client.id !== videoCallDetails.astrologer?.id
      ) {
        newMap.set(videoCallDetails.client.id, {
          name: videoCallDetails.client.name,
          profilePic: videoCallDetails.client.profilePic,
        });
        // Also try with the client ID as a number if it's numeric
        const clientIdNum = parseInt(videoCallDetails.client.id);
        if (!isNaN(clientIdNum)) {
          newMap.set(clientIdNum.toString(), {
            name: videoCallDetails.client.name,
            profilePic: videoCallDetails.client.profilePic,
          });
        }
      }

      // Add participants mapping
      videoCallDetails.participants.forEach((participant) => {
        if (participant.userId) {
          newMap.set(participant.userId, {
            name: participant.user.name,
            profilePic: participant.user.profilePic,
          });
          // Also try with the participant ID as a number if it's numeric
          const participantIdNum = parseInt(participant.userId);
          if (!isNaN(participantIdNum)) {
            newMap.set(participantIdNum.toString(), {
              name: participant.user.name,
              profilePic: participant.user.profilePic,
            });
          }
        }
      });

      // Smart mapping for 2-user calls: map unmapped Agora UIDs to unmapped backend users
      if (remoteUsers.length > 0) {
        const mappedAgoraUids = Array.from(newMap.keys());
        const backendUserIds = [
          videoCallDetails.hostUser?.id,
          videoCallDetails.astrologer?.id,
          videoCallDetails.client?.id,
          ...videoCallDetails.participants.map((p) => p.userId),
        ].filter(Boolean);

        console.log('🔍 Smart mapping check:', {
          mappedAgoraUids,
          backendUserIds,
          remoteUsers: remoteUsers.map((u) => u.uid.toString()),
        });

        // For each remote user UID that's not mapped, try to map it to an unmapped backend user
        remoteUsers.forEach((remoteUser) => {
          const remoteUid = remoteUser.uid.toString();
          if (!newMap.has(remoteUid)) {
            // Find an unmapped backend user
            const unmappedBackendUser = backendUserIds.find(
              (backendId) =>
                !mappedAgoraUids.some(
                  (mappedUid) =>
                    mappedUid === backendId ||
                    mappedUid === parseInt(backendId || '0').toString()
                )
            );

            if (unmappedBackendUser) {
              // Map this remote UID to the unmapped backend user
              let userInfo = null;

              if (videoCallDetails.hostUser?.id === unmappedBackendUser) {
                userInfo = {
                  name: videoCallDetails.hostUser.name,
                  profilePic: videoCallDetails.hostUser.profilePic,
                };
              } else if (
                videoCallDetails.astrologer?.id === unmappedBackendUser
              ) {
                userInfo = {
                  name: videoCallDetails.astrologer.name,
                  profilePic: videoCallDetails.astrologer.profilePic,
                };
              } else if (videoCallDetails.client?.id === unmappedBackendUser) {
                userInfo = {
                  name: videoCallDetails.client.name,
                  profilePic: videoCallDetails.client.profilePic,
                };
              } else {
                const participant = videoCallDetails.participants.find(
                  (p) => p.userId === unmappedBackendUser
                );
                if (participant) {
                  userInfo = {
                    name: participant.user.name,
                    profilePic: participant.user.profilePic,
                  };
                }
              }

              if (userInfo) {
                newMap.set(remoteUid, userInfo);
                console.log(
                  '🔍 Smart mapped remote UID:',
                  remoteUid,
                  'to user:',
                  userInfo.name
                );
              }
            }
          }
        });
      }

      console.log('🔍 Final UID mapping:', Object.fromEntries(newMap));
      setUidToUserMap(newMap);
    }
  }, [videoCallDetails, tokenData, userInfo, remoteUsers]);

  // Real-time recording status detection for all users
  useEffect(() => {
    if (!isConnected || !videoCallId) return;

    // Check recording status when user joins
    const checkInitialRecordingStatus = async () => {
      try {
        await refetchRecordingStatus();
        console.log('🔍 Initial recording status checked for user');
      } catch (error) {
        console.error('❌ Error checking initial recording status:', error);
      }
    };

    // Check immediately when connected
    checkInitialRecordingStatus();

    // Set up periodic check for non-host users
    const intervalId = setInterval(async () => {
      if (!isHost) {
        try {
          await refetchRecordingStatus();
          console.log('🔍 Periodic recording status check for non-host user');
        } catch (error) {
          console.error('❌ Error in periodic recording status check:', error);
        }
      }
    }, 5000); // Check every 5 seconds for non-host users

    return () => {
      clearInterval(intervalId);
    };
  }, [isConnected, videoCallId, isHost, refetchRecordingStatus]);

  // Check recording status when remote users change (host joins/leaves)
  useEffect(() => {
    if (isConnected && !isHost) {
      // Small delay to allow host to start recording
      const timer = setTimeout(async () => {
        try {
          await refetchRecordingStatus();
          console.log('🔍 Recording status checked due to remote users change');
        } catch (error) {
          console.error(
            '❌ Error checking recording status on user change:',
            error
          );
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [remoteUsers.length, isConnected, isHost, refetchRecordingStatus]);

  // Derived state
  const isRecording = recordingStatus?.isRecording ?? false;
  const isTranscribing = transcriptionStatus?.isActive ?? false;
  const participants = videoCallDetails?.participants || [];
  const hostUser = videoCallDetails?.hostUser;

  // Debug remote users
  console.log('🔍 Remote users debug:', {
    remoteUsers: remoteUsers.map((u) => ({
      uid: u.uid,
      hasVideo: u.hasVideo,
      hasAudio: u.hasAudio,
      isScreen: u.isScreen,
      videoTrackLabel: u.videoTrack?.getTrackLabel?.(),
    })),
    uidToUserMap: Object.fromEntries(uidToUserMap),
    videoCallDetails: videoCallDetails
      ? {
          hostUser: videoCallDetails.hostUser,
          astrologer: videoCallDetails.astrologer,
          client: videoCallDetails.client,
          participants: videoCallDetails.participants,
        }
      : null,
    tokenData: tokenData
      ? {
          uid: tokenData.uid,
          channelName: tokenData.channelName,
        }
      : null,
  });

  // Screen sharing state
  const anyScreenActive =
    isScreenSharing ||
    !!localScreenTrack ||
    remoteUsers.some((u) => u.isScreen && u.hasVideo);
  const remoteScreenUser = remoteUsers.find((u) => u.isScreen && u.hasVideo);
  const nonScreenRemoteUser = remoteUsers.find((u) => !u.isScreen);

  // Debug screen sharing state
  console.log('🔍 Screen sharing debug:', {
    localScreenTrack: !!localScreenTrack,
    isScreenSharing,
    remoteUsers: remoteUsers.map((u) => ({
      uid: u.uid,
      isScreen: u.isScreen,
      hasVideo: u.hasVideo,
    })),
    anyScreenActive,
    remoteScreenUser: !!remoteScreenUser,
    nonScreenRemoteUser: !!nonScreenRemoteUser,
  });

  // Debug screen track selection
  const finalScreenTrack = localScreenTrack || remoteScreenUser?.videoTrack;
  console.log('🔍 Screen track selection:', {
    localScreenTrack: !!localScreenTrack,
    remoteScreenUser: !!remoteScreenUser,
    remoteScreenTrack: !!remoteScreenUser?.videoTrack,
    finalScreenTrack: !!finalScreenTrack,
    isLocalScreen: !!localScreenTrack,
    isRemoteScreen: !!remoteScreenUser?.videoTrack,
  });

  // Determine user role and host status
  useEffect(() => {
    if (videoCallDetails && userInfo) {
      const currentUserId = userInfo.id;
      const isCurrentUserHost = hostUser?.id === currentUserId;

      setIsHost(!!isCurrentUserHost);
      setUserRole(isCurrentUserHost ? 'astro' : 'user');
    }
  }, [videoCallDetails, userInfo, hostUser]);

  // Create preview tracks on mount
  useEffect(() => {
    if (!isConnected && !isPreviewReady) {
      createPreviewTracks();
    }
  }, [isConnected, isPreviewReady, createPreviewTracks]);

  // Update preview state when tracks are available
  useEffect(() => {
    console.log('🔍 Preview tracks check:', {
      previewVideoTrack: !!previewVideoTrack,
      previewAudioTrack: !!previewAudioTrack,
      isPreviewReady,
      videoEnabled: previewVideoTrack?.enabled,
      audioEnabled: previewAudioTrack?.enabled,
    });

    if (previewVideoTrack && previewAudioTrack) {
      setIsPreviewReady(true);
      console.log('🔍 Preview tracks ready');
    }
  }, [previewVideoTrack, previewAudioTrack, isPreviewReady]);

  // Handle call end when all users leave
  const handleCallEnd = async () => {
    if (callEnded) return;
    setCallEnded(true);
    console.log('📞 Call ended - all users have left');

    if (isRecording) {
      console.log('🎬 Stopping recording due to call end...');
      try {
        await stopRecordingMutation.mutateAsync({
          videoCallId,
          recordingDuration: recordingStartTime
            ? Math.floor((Date.now() - recordingStartTime.getTime()) / 1000)
            : 0,
        });
      } catch (error) {
        console.error('❌ Error stopping recording on call end:', error);
      }
    }
  };

  // Handle user leaving
  useEffect(() => {
    if (remoteUsers.length === 0 && isConnected) {
      const timer = setTimeout(() => {
        handleCallEnd();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [remoteUsers.length, isConnected]);

  // Handle recording status changes
  useEffect(() => {
    console.log('🔍 Recording status changed:', {
      isRecording,
      recordingStartTime: recordingStartTime?.toISOString(),
      isHost,
      userRole: userRole,
      remoteUsersCount: remoteUsers.length,
    });

    if (isRecording && !recordingStartTime) {
      setRecordingStartTime(new Date());
      console.log('🎬 Recording started - timer set');
    } else if (!isRecording && recordingStartTime) {
      setRecordingStartTime(null);
      console.log('🛑 Recording stopped - timer cleared');
    }
  }, [isRecording, recordingStartTime, isHost, userRole, remoteUsers.length]);

  // Recording status is now handled by API polling only

  // Join call handler
  const handleJoinCall = async () => {
    if (!tokenData) {
      console.error('❌ No token data available');
      return;
    }

    if (isRetrying) {
      console.log('⏳ Already retrying, please wait...');
      return;
    }

    // Check if token is still valid (basic check)
    const now = Date.now();
    const tokenExpiry = tokenData.expiresAt
      ? new Date(tokenData.expiresAt).getTime()
      : now + 3600000; // Default 1 hour

    if (now >= tokenExpiry) {
      console.error('❌ Token has expired, please refresh the page');
      // Note: setError is controlled by the hook, not available here
      return;
    }

    try {
      await joinCall(
        process.env.NEXT_PUBLIC_AGORA_APP_ID ||
          'a2ca3c0b60cc448589b8f5c5281419f3',
        tokenData.channelName,
        tokenData.token,
        tokenData.uid
      );
      if (isHost) {
        // Host starts recording automatically
        await startRecordingMutation.mutateAsync(videoCallId);
        console.log('🎬 Host started recording automatically');

        // Host starts transcription automatically
        try {
          const transcriptionResult =
            await startTranscriptionMutation.mutateAsync(videoCallId);
          setTranscriptionAgentId(transcriptionResult.agentId);
          console.log('xxx--- Host started transcription automatically');
        } catch (error) {
          console.error('xxx--- Failed to start transcription:', error);
        }
      } else {
        // Non-host users check recording status
        await refetchRecordingStatus();
        console.log('🔍 Non-host user checked recording status');
      }
      await VideoCallService.joinVideoCall(videoCallId);
    } catch (error: any) {
      console.error('❌ Error joining call:', error);

      // Handle specific Agora errors - these will be handled by the hook's error state
      if (error?.code === 'OPERATION_ABORTED') {
        console.error(
          'Connection was canceled. This might be due to a token issue.'
        );
      } else if (error?.code === 'INVALID_TOKEN') {
        console.error(
          'Invalid token. Please refresh the page to get a new token.'
        );
      } else if (error?.code === 'TOKEN_EXPIRED') {
        console.error(
          'Token has expired. Please refresh the page to get a new token.'
        );
      } else {
        console.error(
          `Failed to join call: ${error?.message || 'Unknown error'}`
        );
      }
    }
  };

  // Retry handler
  const handleRetry = async () => {
    setIsRetrying(true);
    // Note: setError is controlled by the hook, not available here

    // Wait a bit before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await handleJoinCall();
    } finally {
      setIsRetrying(false);
    }
  };

  // Screen share toggle handler with loading state
  const handleToggleScreenShare = async () => {
    if (isScreenShareLoading) {
      console.log('⏳ Screen share operation already in progress...');
      return;
    }

    setIsScreenShareLoading(true);
    try {
      await toggleScreenShare();
    } catch (error) {
      console.error('❌ Error toggling screen share:', error);
    } finally {
      // Add a small delay to prevent rapid clicking
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsScreenShareLoading(false);
    }
  };

  // Leave call handler
  const handleLeaveCall = async () => {
    const isLastUser = remoteUsers.length === 0;

    if (isLastUser && isRecording) {
      try {
        await stopRecordingMutation.mutateAsync({
          videoCallId,
          recordingDuration: recordingStartTime
            ? Math.floor((Date.now() - recordingStartTime.getTime()) / 1000)
            : 0,
        });
      } catch (error) {
        console.error('❌ Error stopping recording:', error);
      }
    }

    // Stop transcription if host
    if (isHost && transcriptionAgentId) {
      try {
        await stopTranscriptionMutation.mutateAsync(transcriptionAgentId);
        console.log('🎤 Host stopped transcription');
      } catch (error) {
        console.error('❌ Error stopping transcription:', error);
      }
    }

    await leaveCall();
    isHost &&
      (await stopRecordingMutation.mutateAsync({
        videoCallId,
        recordingDuration: recordingStartTime
          ? Math.floor((Date.now() - recordingStartTime.getTime()) / 1000)
          : 0,
      }));
    await VideoCallService.leaveVideoCall(videoCallId);
  };

  // Preview controls handlers
  const handlePreviewToggleVideo = async () => {
    if (previewVideoTrack) {
      try {
        const newVideoState = !previewVideoEnabled;
        await previewVideoTrack.setEnabled(newVideoState);
        setPreviewVideoEnabled(newVideoState);
        console.log('🔍 Preview video toggled:', newVideoState);
      } catch (error) {
        console.error('Error toggling preview video:', error);
      }
    }
  };

  const handlePreviewToggleAudio = async () => {
    if (previewAudioTrack) {
      try {
        const newAudioState = !previewAudioEnabled;
        await previewAudioTrack.setEnabled(newAudioState);
        setPreviewAudioEnabled(newAudioState);
        console.log('🔍 Preview audio toggled:', newAudioState);
      } catch (error) {
        console.error('Error toggling preview audio:', error);
      }
    }
  };

  // Get current user info
  const getCurrentUserName = (): string => {
    if (userInfo?.name) return userInfo.name;
    return userRole === 'astro' ? 'Astromegistus' : 'User';
  };

  const getCurrentUserProfilePic = (): string | undefined => {
    return userInfo?.profilePic;
  };

  // Get participant name by UID
  const getParticipantName = (uid: string | number): string => {
    console.log(
      '🔍 Getting participant name for UID:',
      uid,
      'Type:',
      typeof uid
    );
    console.log('🔍 UID mapping keys:', Array.from(uidToUserMap.keys()));
    console.log('🔍 UID mapping values:', Object.fromEntries(uidToUserMap));

    const uidStr = uid.toString();

    // First try the UID mapping with exact match
    const mappedUser = uidToUserMap.get(uidStr);
    if (mappedUser) {
      console.log('🔍 Found in UID mapping:', mappedUser.name);
      return mappedUser.name;
    }

    // Try to find by numeric conversion if UID is a number
    if (typeof uid === 'number') {
      const numericUser = uidToUserMap.get(uid.toString());
      if (numericUser) {
        console.log('🔍 Found in UID mapping (numeric):', numericUser.name);
        return numericUser.name;
      }
    }

    // Fallback to old method if no mapping found
    if (!videoCallDetails) return `User ${uid}`;

    // Find participant by UID in the participants array
    const participant = videoCallDetails.participants.find(
      (p) => p.userId === uidStr || p.userId === uid.toString()
    );

    if (participant) {
      console.log('🔍 Found participant:', participant.user.name);
      return participant.user.name;
    }

    // Check if UID matches host (try both string and numeric)
    if (
      videoCallDetails.hostUser.id === uidStr ||
      videoCallDetails.hostUser.id === uid.toString()
    ) {
      console.log('🔍 Found host:', videoCallDetails.hostUser.name);
      return videoCallDetails.hostUser.name;
    }

    // Check if UID matches astrologer (try both string and numeric)
    if (
      videoCallDetails.astrologer?.id === uidStr ||
      videoCallDetails.astrologer?.id === uid.toString()
    ) {
      console.log('🔍 Found astrologer:', videoCallDetails.astrologer.name);
      return videoCallDetails.astrologer.name;
    }

    // Check if UID matches client (try both string and numeric)
    if (
      videoCallDetails.client?.id === uidStr ||
      videoCallDetails.client?.id === uid.toString()
    ) {
      console.log('🔍 Found client:', videoCallDetails.client.name);
      return videoCallDetails.client.name;
    }

    // Last resort: try to find any available user from the backend data
    if (videoCallDetails) {
      // If this is likely a 2-user call and we have backend data, try to find the other user
      const allBackendUsers = [
        {
          id: videoCallDetails.hostUser?.id,
          name: videoCallDetails.hostUser?.name,
          profilePic: videoCallDetails.hostUser?.profilePic,
        },
        {
          id: videoCallDetails.astrologer?.id,
          name: videoCallDetails.astrologer?.name,
          profilePic: videoCallDetails.astrologer?.profilePic,
        },
        {
          id: videoCallDetails.client?.id,
          name: videoCallDetails.client?.name,
          profilePic: videoCallDetails.client?.profilePic,
        },
        ...videoCallDetails.participants.map((p) => ({
          id: p.userId,
          name: p.user.name,
          profilePic: p.user.profilePic,
        })),
      ].filter((user) => user.id && user.name);

      // If we have exactly 2 backend users and current user is one of them, return the other
      if (allBackendUsers.length === 2) {
        const currentUserBackendId = tokenData?.uid?.toString();
        const otherUser = allBackendUsers.find(
          (user) => user.id !== currentUserBackendId && user.id !== userInfo?.id
        );

        if (otherUser && otherUser.name) {
          console.log('🔍 Found other user in 2-user call:', otherUser.name);
          return otherUser.name;
        }
      }

      // Try to find any user that's not the current user
      const currentUserBackendId = tokenData?.uid?.toString();
      const otherUser = allBackendUsers.find(
        (user) => user.id !== currentUserBackendId && user.id !== userInfo?.id
      );

      if (otherUser && otherUser.name) {
        console.log('🔍 Found other user as fallback:', otherUser.name);
        return otherUser.name;
      }
    }

    // Try to extract a meaningful name from the UID if it's numeric
    if (typeof uid === 'number' || /^\d+$/.test(uidStr)) {
      // For numeric UIDs, try to find a pattern or use a more friendly name
      const numericUid = parseInt(uidStr);
      if (numericUid > 1000000000) {
        // This looks like a timestamp-based UID, use a generic name
        return `User ${numericUid.toString().slice(-4)}`; // Last 4 digits
      }
    }

    console.log('🔍 No match found, using fallback');
    return `User ${uid}`;
  };

  // Get participant profile picture by UID
  const getParticipantProfilePic = (
    uid: string | number
  ): string | undefined => {
    console.log('🔍 Getting participant profile pic for UID:', uid);

    const uidStr = uid.toString();

    // First try the UID mapping
    const mappedUser = uidToUserMap.get(uidStr);
    if (mappedUser) {
      console.log(
        '🔍 Found profile pic in UID mapping:',
        mappedUser.profilePic
      );
      return mappedUser.profilePic;
    }

    // Fallback to old method if no mapping found
    if (!videoCallDetails) return undefined;

    // Find participant by UID in the participants array
    const participant = videoCallDetails.participants.find(
      (p) => p.userId === uidStr || p.userId === uid.toString()
    );

    if (participant) {
      return participant.user.profilePic;
    }

    // Check if UID matches host (try both string and numeric)
    if (
      videoCallDetails.hostUser.id === uidStr ||
      videoCallDetails.hostUser.id === uid.toString()
    ) {
      return videoCallDetails.hostUser.profilePic;
    }

    // Check if UID matches astrologer (try both string and numeric)
    if (
      videoCallDetails.astrologer?.id === uidStr ||
      videoCallDetails.astrologer?.id === uid.toString()
    ) {
      return videoCallDetails.astrologer.profilePic;
    }

    // Check if UID matches client (try both string and numeric)
    if (
      videoCallDetails.client?.id === uidStr ||
      videoCallDetails.client?.id === uid.toString()
    ) {
      return videoCallDetails.client.profilePic;
    }

    return undefined;
  };

  // Show loading state during SSR or when data is loading
  if (!isClient || isLoadingDetails || isLoadingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-green via-charcoal to-graphite">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden-glow mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading video call...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!videoCallDetails || !tokenData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-green via-charcoal to-graphite">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Video Call Not Found
          </h1>
          <p className="text-soft-cream">
            The video call you're looking for doesn't exist or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-green via-charcoal to-graphite overflow-hidden">
      {!isConnected ? (
        // Pre-join interface
        <div className="min-h-screen bg-gradient-to-br from-emerald-green via-charcoal to-graphite flex">
          {/* Left Side - Video Preview */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative w-full max-w-2xl">
              <div
                className="relative bg-charcoal rounded-lg overflow-hidden shadow-2xl border border-golden-glow/20"
                style={{ aspectRatio: '16/9' }}
              >
                <VideoPlayer
                  videoTrack={previewVideoTrack}
                  audioTrack={previewAudioTrack}
                  isEnabled={previewVideoEnabled}
                  isLocal={true}
                  userName={getCurrentUserName()}
                  userProfilePic={getCurrentUserProfilePic()}
                  className="w-full h-full"
                  isPreview={true}
                />

                <PreJoinControls
                  isVideoEnabled={previewVideoEnabled}
                  isAudioEnabled={previewAudioEnabled}
                  onToggleVideo={handlePreviewToggleVideo}
                  onToggleAudio={handlePreviewToggleAudio}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Join Panel */}
          <div className="w-96 glass-effect flex flex-col justify-center p-8 border-l border-golden-glow/20">
            <div className="max-w-sm mx-auto w-full">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-white mb-2">
                  Ready to join?
                </h1>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-red-800 mb-3">
                        Permission Required
                      </h3>
                      <div className="text-sm text-red-700 whitespace-pre-line mb-4">
                        {error}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={handleRetry}
                          disabled={isRetrying}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          {isRetrying ? 'Retrying...' : 'Retry'}
                        </button>
                        <button
                          onClick={() => window.location.reload()}
                          className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Refresh Page
                        </button>
                        <button
                          onClick={() => setShowTroubleshooting(true)}
                          className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Troubleshoot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleJoinCall}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark hover:from-golden-glow-dark hover:via-pink-shade hover:to-golden-glow disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <span>Join now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Video call interface
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <div className="glass-effect px-6 py-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image
                  src={logo}
                  alt="Astromegistus Logo"
                  width={60}
                  height={60}
                  className="object-contain cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-soft-cream text-sm">
                {remoteUsers.length + 1} participant
                {remoteUsers.length !== 0 ? 's' : ''}
              </div>
              {isRecording && (
                <div className="flex items-center space-x-2 text-red-400 bg-red-500/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">RECORDING</span>
                </div>
              )}
              {isTranscribing && (
                <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">TRANSCRIBING</span>
                </div>
              )}

              {isScreenSharing && (
                <div className="flex items-center space-x-2 text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2h-5v2h3a1 1 0 110 2H6a1 1 0 110-2h3v-2H4a2 2 0 01-2-2V4zm2 0h12v7H4V4z" />
                  </svg>
                  <span className="text-xs font-medium">SCREEN SHARING</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Layout */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 flex">
              {(() => {
                console.log('🔍 Layout condition check:', {
                  anyScreenActive,
                  localScreenTrack: !!localScreenTrack,
                  isScreenSharing,
                  remoteUsers: remoteUsers.length,
                  remoteScreenUser: !!remoteScreenUser,
                  nonScreenRemoteUser: !!nonScreenRemoteUser,
                });
                return null;
              })()}
              {anyScreenActive ? (
                // Screen sharing layout
                <>
                  {/* Left: large screen share */}
                  <div className="flex-[2] relative glass-effect rounded-lg overflow-hidden border border-white/20 m-2">
                    {(() => {
                      console.log('🔍 Screen sharing layout - Screen track:', {
                        localScreenTrack: !!localScreenTrack,
                        remoteScreenUser: !!remoteScreenUser,
                        remoteScreenTrack: !!remoteScreenUser?.videoTrack,
                        finalScreenTrack: !!(
                          localScreenTrack || remoteScreenUser?.videoTrack
                        ),
                      });
                      return null;
                    })()}
                    <ScreenSharePlayer
                      screenTrack={finalScreenTrack}
                      isLocal={!!localScreenTrack}
                      className="w-full h-full"
                    />
                  </div>
                  {/* Right: vertical strip - local on top, other participants below */}
                  <div className="flex-1 flex flex-col space-y-2 m-2">
                    {/* Local user (when NOT screen sharing) */}
                    {!localScreenTrack && (
                      <div className="relative glass-effect rounded-lg overflow-hidden border border-white/20 min-h-[100%]">
                        <VideoPlayer
                          videoTrack={localVideoTrack}
                          audioTrack={localAudioTrack}
                          isEnabled={isVideoEnabled}
                          isLocal={true}
                          userName="You"
                          userProfilePic={userInfo?.profilePic}
                          hasAudio={isAudioEnabled}
                          hasVideo={isVideoEnabled}
                          className="w-full h-full"
                          showNameBadge={true}
                        />
                      </div>
                    )}

                    {/* Other participant */}
                    {nonScreenRemoteUser && (
                      <div className="relative glass-effect rounded-lg overflow-hidden border border-white/20 min-h-[100%]">
                        <VideoPlayer
                          videoTrack={nonScreenRemoteUser.videoTrack}
                          audioTrack={nonScreenRemoteUser.audioTrack}
                          isEnabled={nonScreenRemoteUser.hasVideo}
                          isLocal={false}
                          userName={getParticipantName(nonScreenRemoteUser.uid)}
                          userProfilePic={getParticipantProfilePic(
                            nonScreenRemoteUser.uid
                          )}
                          hasAudio={nonScreenRemoteUser.hasAudio}
                          hasVideo={nonScreenRemoteUser.hasVideo}
                          className="w-full h-full"
                          showNameBadge={true}
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // No screen sharing: side-by-side layout
                <div className="flex-1 flex space-x-2 m-2">
                  {/* Left: Remote user or waiting message */}
                  <div className="flex-1 relative glass-effect rounded-lg overflow-hidden border border-white/20">
                    {nonScreenRemoteUser ? (
                      <VideoPlayer
                        videoTrack={nonScreenRemoteUser.videoTrack}
                        audioTrack={nonScreenRemoteUser.audioTrack}
                        isEnabled={nonScreenRemoteUser.hasVideo}
                        isLocal={false}
                        userName={getParticipantName(nonScreenRemoteUser.uid)}
                        userProfilePic={getParticipantProfilePic(
                          nonScreenRemoteUser.uid
                        )}
                        hasAudio={nonScreenRemoteUser.hasAudio}
                        hasVideo={nonScreenRemoteUser.hasVideo}
                        className="w-full h-full"
                        showNameBadge={true}
                      />
                    ) : (
                      <WaitingForParticipants className="w-full h-full" />
                    )}
                  </div>

                  {/* Right: Local user */}
                  <div className="flex-1 relative glass-effect rounded-lg overflow-hidden border border-white/20">
                    {(() => {
                      console.log('🔍 Local user VideoPlayer props:', {
                        videoTrack: !!localVideoTrack,
                        audioTrack: !!localAudioTrack,
                        isEnabled: isVideoEnabled,
                        isLocal: true,
                        userName: getCurrentUserName(),
                        userProfilePic: getCurrentUserProfilePic(),
                      });
                      return null;
                    })()}
                    <VideoPlayer
                      videoTrack={localVideoTrack}
                      audioTrack={localAudioTrack}
                      isEnabled={isVideoEnabled}
                      isLocal={true}
                      userName={getCurrentUserName()}
                      userProfilePic={getCurrentUserProfilePic()}
                      hasAudio={isAudioEnabled}
                      hasVideo={isVideoEnabled}
                      className="w-full h-full"
                      showNameBadge={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <Controls
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            isScreenSharing={isScreenSharing}
            isHost={isHost}
            isScreenShareLoading={isScreenShareLoading}
            onToggleVideo={toggleVideo}
            onToggleAudio={toggleAudio}
            onToggleScreenShare={handleToggleScreenShare}
            onLeaveCall={handleLeaveCall}
          />

          {/* Error Display */}
          {error && (
            <div className="bg-red-500 text-white px-4 py-3 text-center text-sm">
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="whitespace-pre-line">{error}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Permission Troubleshooting Modal */}
      {showTroubleshooting && (
        <PermissionTroubleshooting
          onRetry={() => {
            setShowTroubleshooting(false);
            handleRetry();
          }}
          onClose={() => setShowTroubleshooting(false)}
        />
      )}
    </div>
  );
};
