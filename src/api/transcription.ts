/**
 * React Query hooks for Agora Transcription
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';

// Start transcription mutation
export const useStartTranscription = () => {
  return useMutation({
    mutationFn: async (videoCallId: string) => {
      // Step 1: Get participant UIDs
      const participantsRes = await axiosInstance.get(
        `/agora-transcription/participants/${videoCallId}`
      );

      const config = participantsRes.data.data.transcriptionConfig;

      // Step 2: Start transcription
      const startRes = await axiosInstance.post('/agora-transcription/start', {
        channelName: config.channelName,
        audioUID: config.audioUID,
        textUID: config.textUID,
        rtcUserUid: config.rtcUserUid,
        languages: ['en-US'],
      });

      return startRes.data.data;
    },
    onSuccess: (data) => {
      console.log('xxx--- Transcription started:', data.agentId);
    },
    onError: (error: any) => {
      console.error('xxx--- Failed to start transcription:', error);
      console.error('Error details:', error.response?.data);
    },
  });
};

// Stop transcription mutation
export const useStopTranscription = () => {
  return useMutation({
    mutationFn: async (agentId: string) => {
      const response = await axiosInstance.post(
        `/agora-transcription/stop/${agentId}`
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      console.log('xxx--- Transcription stopped');
      console.log('xxx--- Transcript saved to S3', data);
    },
    onError: (error: any) => {
      console.error('xxx--- Failed to stop transcription:', error);
    },
  });
};

// Get transcription status
export const useTranscriptionStatus = (channelName: string | null) => {
  return useQuery({
    queryKey: ['transcription-status', channelName],
    queryFn: async () => {
      if (!channelName) return { isActive: false };
      const response = await axiosInstance.get(
        `/agora-transcription/status/${channelName}`
      );
      return response.data.data;
    },
    enabled: !!channelName,
    refetchInterval: 5000, // Poll every 5 seconds
  });
};
