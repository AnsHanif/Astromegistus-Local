import axiosInstance from './axios';

// Types
export interface VideoCallToken {
  token: string;
  appId: string;
  channelName: string;
  uid: string | number;
  expireTime: number;
}

export interface CreateVideoCallRequest {
  coachingBookingId?: string;
}

export interface CreateVideoCallResponse {
  videoCall: {
    id: string;
    channelName: string;
    hostUserId: string;
    status: string;
    createdAt: string;
    hostUser: {
      id: string;
      name: string;
      email: string;
      profilePic?: string;
    };
    coachingBooking?: {
      id: string;
      session: {
        title: string;
      };
      user: {
        id: string;
        name: string;
        email: string;
        profilePic?: string;
      };
    };
  };
  token: string;
  appId: string;
}

export interface VideoCallDetails {
  id: string;
  channelName: string;
  hostUserId: string;
  status: 'WAITING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  hostUser: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
  };
  astrologer?: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
  };
  client?: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
  };
  participants: Array<{
    id: string;
    userId: string;
    joinedAt?: string;
    leftAt?: string;
    duration?: number;
    user: {
      id: string;
      name: string;
      email: string;
      profilePic?: string;
    };
  }>;
  recordings: Array<{
    id: string;
    resourceId?: string;
    sid?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    duration?: number;
    status: 'STARTING' | 'RECORDING' | 'STOPPING' | 'COMPLETED' | 'FAILED';
    startedAt?: string;
    completedAt?: string;
  }>;
  transcriptions: Array<{
    id: string;
    text: string;
    timestamp: string;
    confidence?: number;
    participant?: {
      id: string;
      name: string;
    };
  }>;
  coachingBooking?: {
    id: string;
    session: {
      title: string;
    };
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface StartRecordingResponse {
  recordingId: string;
  resourceId: string;
  sid: string;
}

export interface StopRecordingResponse {
  recordingId: string;
  duration: number;
}

export interface SaveTranscriptionRequest {
  text: string;
  participantUserId?: string;
  confidence?: number;
}

export interface LayoutConfig {
  uid: string;
  x_axis: number;
  y_axis: number;
  width: number;
  height: number;
  alpha: number;
  render_mode: number;
}

export interface UpdateLayoutRequest {
  layoutConfig: {
    mixedVideoLayout: number;
    backgroundColor?: string;
    layoutConfig: LayoutConfig[];
  };
}

export interface UpdateLayoutResponse {
  success: boolean;
  message: string;
  data: {
    videoCallId: string;
    channelName: string;
    resourceId: string;
    sid: string;
    layoutConfig: UpdateLayoutRequest['layoutConfig'];
    updatedAt: string;
  };
}

class VideoCallAPI {
  private baseURL = '/videocalls';

  /**
   * Generate Agora RTC token
   */
  async generateToken(
    channelName: string,
    uid: number,
    role: 'publisher' | 'audience' = 'publisher',
    expireTime: number = 3600
  ): Promise<VideoCallToken> {
    try {
      const response = await axiosInstance.post(`${this.baseURL}/token`, {
        channelName,
        uid,
        role,
        expireTime,
      });
      return response.data;
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  }

  /**
   * Create a new video call
   */
  async createVideoCall(
    data?: CreateVideoCallRequest
  ): Promise<CreateVideoCallResponse> {
    try {
      const response = await axiosInstance.post(this.baseURL, data || {});
      return response.data;
    } catch (error) {
      console.error('Error creating video call:', error);
      throw error;
    }
  }

  /**
   * Join an existing video call
   */
  async joinVideoCall(channelName: string): Promise<CreateVideoCallResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseURL}/${channelName}/join`
      );
      return response.data;
    } catch (error) {
      console.error('Error joining video call:', error);
      throw error;
    }
  }

  /**
   * Leave a video call
   */
  async leaveVideoCall(channelName: string): Promise<void> {
    try {
      await axiosInstance.post(`${this.baseURL}/${channelName}/leave`);
    } catch (error) {
      console.error('Error leaving video call:', error);
      throw error;
    }
  }

  /**
   * Start cloud recording
   */
  async startRecording(videoCallId: string): Promise<StartRecordingResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseURL}/${videoCallId}/agora-recording/start`
      );
      return response.data;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  /**
   * Stop cloud recording
   */
  async stopRecording(
    videoCallId: string,
    recordingData?: { resourceId: string; sid: string }
  ): Promise<StopRecordingResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseURL}/${videoCallId}/agora-recording/stop`,
        recordingData || {}
      );
      return response.data;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  /**
   * Get video call details
   */
  async getVideoCallDetails(channelName: string): Promise<VideoCallDetails> {
    try {
      const response = await axiosInstance.get(
        `${this.baseURL}/${channelName}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting video call details:', error);
      throw error;
    }
  }

  /**
   * Save transcription
   */
  async saveTranscription(
    channelName: string,
    data: SaveTranscriptionRequest
  ): Promise<void> {
    try {
      await axiosInstance.post(
        `${this.baseURL}/${channelName}/transcription`,
        data
      );
    } catch (error) {
      console.error('Error saving transcription:', error);
      throw error;
    }
  }

  /**
   * Get user's video calls
   */
  async getUserVideoCalls(): Promise<VideoCallDetails[]> {
    try {
      const response = await axiosInstance.get(`${this.baseURL}/user/calls`);
      return response.data;
    } catch (error) {
      console.error('Error getting user video calls:', error);
      throw error;
    }
  }

  /**
   * Get coaching session video calls
   */
  async getCoachingSessionCalls(
    bookingId: string
  ): Promise<VideoCallDetails[]> {
    try {
      const response = await axiosInstance.get(
        `${this.baseURL}/coaching/${bookingId}/calls`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting coaching session calls:', error);
      throw error;
    }
  }

  /**
   * Update recording layout for screen sharing
   */
  async updateRecordingLayout(
    videoCallId: string,
    layoutConfig: UpdateLayoutRequest['layoutConfig']
  ): Promise<UpdateLayoutResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseURL}/${videoCallId}/agora-recording/update-layout`,
        { layoutConfig }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating recording layout:', error);
      throw error;
    }
  }
}

export const videoCallApi = new VideoCallAPI();
export default videoCallApi;
