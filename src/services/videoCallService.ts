/**
 * Video Call Service - Handles API calls for video calling
 */

// Dynamic API URL - works for both localhost and network access
const API_BASE_URL =
  typeof window !== 'undefined'
    ? `${process.env.NEXT_PUBLIC_API_URL}`
    : `${process.env.NEXT_PUBLIC_API_URL}`;

import axiosInstance from './axios';
import Cookies from 'js-cookie';

// Read auth token from cookie for authenticated calls when needed
const getAuthToken = (): string | undefined => Cookies.get('astro-tk');

export interface VideoCall {
  id: string;
  channelName: string;
  status: 'WAITING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  hostUserId: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  createdAt: string;
  meetingTitle?: string;
  meetingType?: string;
  bookingId?: string;
  astrologerId?: string;
  clientId?: string;
  hostUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    profilePic?: string;
  };
  astrologer?: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
    role: string;
  };
  client?: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
    role: string;
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
      role: string;
    };
  }>;
  recording?: {
    status?: string;
    sid?: string;
    resourceId?: string;
    startedAt?: string;
    completedAt?: string;
    fileList?: any;
    filePath?: string;
  };
  transcription?: {
    agentId?: string;
    isActive: boolean;
    s3Note?: string;
  };
}

export class VideoCallService {
  /**
   * Get Agora RTC token using authenticated axios instance
   */
  static async getAgoraToken(
    videoCallId: string,
    role: 'publisher' | 'subscriber' = 'publisher'
  ): Promise<{
    token: string;
    appId: string;
    channelName: string;
    uid: number;
    role: 'publisher' | 'subscriber';
    expiresAt: string;
    videoCall: VideoCall;
  }> {
    const { data } = await axiosInstance.post('/agora/token', {
      videoCallId,
      role,
    });

    // Backend uses sendResponse -> { message, status_code, data }
    if (!data?.data) {
      throw new Error(data?.message || 'Failed to get Agora token');
    }

    return data.data;
  }

  /**
   * Create a video call (ASTROMEGISTUS only)
   */
  static async createVideoCall(
    userType: 'astro' | 'user' = 'astro'
  ): Promise<VideoCall> {
    const token = getAuthToken();

    const response = await axiosInstance.post(`${API_BASE_URL}/videocalls`, {
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    if (!response.status) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data.videoCall;
  }

  /**
   * Join a video call
   */
  static async joinVideoCall(videoCallId: string): Promise<any> {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/videocalls/${videoCallId}/join`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data;
  }

  /**
   * Leave a video call
   */
  static async leaveVideoCall(videoCallId: string): Promise<void> {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/videocalls/${videoCallId}/leave`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }
  }

  /**
   * Get my video calls
   */
  static async getMyVideoCalls(
    userType: 'astro' | 'user' = 'astro'
  ): Promise<VideoCall[]> {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/videocalls/my`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data.videoCalls;
  }

  /**
   * Get video call details with participants
   */
  static async getVideoCallDetails(videoCallId: string): Promise<{
    id: string;
    channelName: string;
    status: string;
    startedAt?: string;
    endedAt?: string;
    duration?: number;
    transcription?: {
      agentId?: string;
      isActive: boolean;
      s3Note?: string;
    };
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
      user: {
        id: string;
        name: string;
        email: string;
        profilePic?: string;
      };
    }>;
  }> {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/videocalls/${videoCallId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data.videoCall;
  }

  /**
   * Get video call recording status
   */
  static async getVideoCallRecordingStatus(
    videoCallId: string
  ): Promise<boolean> {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/videocalls/${videoCallId}/agora-recording/status`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data.recording;
  }

  /**
   * Create video call with meeting details
   */
  static async createVideoCallWithMeeting(meetingData: {
    meetingTitle: string;
    meetingType: 'ASTROLOGY_READING' | 'COACHING_SESSION';
    bookingId?: string;
    astrologerId?: string;
    clientId?: string;
    coachingBookingId?: string;
  }): Promise<{
    videoCall: VideoCall;
    meetingLink: string;
  }> {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/videocalls/meeting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(meetingData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data;
  }

  /**
   * Generate meeting link for booking
   */
  static async generateMeetingLink(bookingId: string): Promise<{
    booking: any;
    meetingLink: string;
    videoCallId: string;
  }> {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/booking/${bookingId}/meeting-link`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data;
  }

  /**
   * Get meeting link for booking
   */
  static async getMeetingLink(bookingId: string): Promise<{
    booking: any;
  }> {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/booking/${bookingId}/meeting-link`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data;
  }

  /**
   * Generate meeting link for coaching booking
   */
  static async generateCoachingMeetingLink(bookingId: string): Promise<{
    booking: any;
    meetingLink: string;
    videoCallId: string;
  }> {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/coaching/bookings/${bookingId}/meeting-link`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data;
  }

  /**
   * Get meeting link for coaching booking
   */
  static async getCoachingMeetingLink(bookingId: string): Promise<{
    booking: any;
  }> {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/coaching/bookings/${bookingId}/meeting-link`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data;
  }

  static async startTranscription(videoCallId: string): Promise<void> {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/videocalls/${videoCallId}/start-transcription`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          body: JSON.stringify({}),
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.data;
  }

  static async stopTranscription(videoCallId: string): Promise<void> {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/videocalls/${videoCallId}/stop-transcription`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          body: JSON.stringify({}),
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }
    return data.data;
  }
}
