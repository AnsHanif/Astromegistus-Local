import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VideoCallService } from '@/services/videoCallService';
import Cookies from 'js-cookie';

const getAuthToken = (): string | undefined => Cookies.get('astro-tk');

export interface RecordingStatus {
  isRecording: boolean;
  resourceId?: string;
  sid?: string;
  startTime?: Date;
}

export interface RecordingResponse {
  data: {
    recording: RecordingStatus;
  };
  message: string;
}

/**
 * Start recording mutation
 */
export const useStartRecording = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoCallId: string) => {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/videocalls/${videoCallId}/agora-recording/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start recording');
      }

      return response.json() as Promise<RecordingResponse>;
    },
    onSuccess: async (data, videoCallId) => {
      // Update recording status in cache
      queryClient.setQueryData(['recording-status', videoCallId], {
        isRecording: true,
      });

      // Invalidate and refetch to get latest status from API
      await queryClient.invalidateQueries({
        queryKey: ['recording-status', videoCallId],
      });

      console.log('✅ Recording started - status API called');
    },
    onError: (error) => {
      console.error('❌ Error starting recording:', error);
    },
  });
};

/**
 * Stop recording mutation
 */
export const useStopRecording = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoCallId,
      recordingDuration = 0,
    }: {
      videoCallId: string;
      recordingDuration?: number;
    }) => {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/videocalls/${videoCallId}/agora-recording/stop`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            videoCallId: videoCallId,
            stoppedAt: new Date().toISOString(),
            recordingDuration: recordingDuration,
            reason: 'user_hangup',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to stop recording');
      }

      return response.json() as Promise<RecordingResponse>;
    },
    onSuccess: async (data, { videoCallId }) => {
      // Update recording status in cache
      queryClient.setQueryData(['recording-status', videoCallId], {
        isRecording: false,
      });

      // Invalidate and refetch to get latest status from API
      await queryClient.invalidateQueries({
        queryKey: ['recording-status', videoCallId],
      });

      console.log('✅ Recording stopped - status API called');
    },
    onError: (error) => {
      console.error('❌ Error stopping recording:', error);
    },
  });
};

/**
 * Get recording status query
 */
export const useRecordingStatus = (videoCallId: string) => {
  return useQuery({
    queryKey: ['recording-status', videoCallId],
    queryFn: async () => {
      // Direct API call - no localStorage dependency
      const isCurrentlyRecording =
        await VideoCallService.getVideoCallRecordingStatus(videoCallId);

      console.log('🔍 Recording status from API:', isCurrentlyRecording);
      return { isRecording: isCurrentlyRecording };
    },
    // Conditional polling - only when recording is active
    refetchInterval: (query) => {
      // Poll every 3 seconds only when recording is active
      return query.state.data?.isRecording ? 3000 : false;
    },
    refetchIntervalInBackground: true, // Continue polling in background
    refetchOnWindowFocus: true, // Refetch when tab becomes active
    enabled: !!videoCallId,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

/**
 * Get video call details query
 */
export const useVideoCallDetails = (videoCallId: string) => {
  return useQuery({
    queryKey: ['video-call-details', videoCallId],
    queryFn: () => VideoCallService.getVideoCallDetails(videoCallId),
    enabled: !!videoCallId,
  });
};

/**
 * Get Agora token query
 */
export const useAgoraToken = (
  videoCallId: string,
  role: 'publisher' | 'subscriber' = 'publisher'
) => {
  return useQuery({
    queryKey: ['agora-token', videoCallId, role],
    queryFn: () => VideoCallService.getAgoraToken(videoCallId, role),
    enabled: !!videoCallId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Recording status is now handled by API polling only
// No need for localStorage or custom events
