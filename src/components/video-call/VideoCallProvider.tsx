'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  ILocalVideoTrack,
  ILocalAudioTrack,
  ScreenVideoTrackInitConfig,
} from 'agora-rtc-sdk-ng';
import { VideoCallConfig, VideoCallParticipant } from './VideoCallInterface';
import { videoCallApi } from '../../services/video-call-api';
import {
  SpeechRecognitionService,
  SpeechRecognitionResult,
} from '../../services/speech-recognition';

// Types
interface Recording {
  id: string;
  status: 'STARTING' | 'RECORDING' | 'STOPPING' | 'COMPLETED' | 'FAILED';
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  fileUrl?: string;
}

interface Transcription {
  id: string;
  text: string;
  participantName?: string;
  timestamp: Date;
  confidence?: number;
}

interface VideoCallState {
  client: IAgoraRTCClient | null;
  localVideoTrack: ICameraVideoTrack | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  localScreenTrack: ILocalVideoTrack | null;
  remoteUsers: any[];
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isJoined: boolean;
  isConnecting: boolean;
  participants: VideoCallParticipant[];
  recordings: Recording[];
  transcriptions: Transcription[];
  error: string | null;
  availableCameras: MediaDeviceInfo[];
  availableMicrophones: MediaDeviceInfo[];
  selectedCamera?: string;
  selectedMicrophone?: string;
  // Speech Recognition
  speechRecognition: SpeechRecognitionService | null;
  isTranscriptionEnabled: boolean;
  isTranscribing: boolean;
  transcriptionLanguage: string;
}

type VideoCallAction =
  | { type: 'SET_CLIENT'; payload: IAgoraRTCClient }
  | { type: 'SET_LOCAL_VIDEO_TRACK'; payload: ICameraVideoTrack | null }
  | { type: 'SET_LOCAL_AUDIO_TRACK'; payload: IMicrophoneAudioTrack | null }
  | { type: 'SET_LOCAL_SCREEN_TRACK'; payload: ILocalVideoTrack | null }
  | { type: 'SET_REMOTE_USERS'; payload: any[] }
  | { type: 'TOGGLE_VIDEO'; payload?: boolean }
  | { type: 'TOGGLE_AUDIO'; payload?: boolean }
  | { type: 'SET_SCREEN_SHARING'; payload: boolean }
  | { type: 'SET_JOINED'; payload: boolean }
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_PARTICIPANTS'; payload: VideoCallParticipant[] }
  | { type: 'ADD_PARTICIPANT'; payload: VideoCallParticipant }
  | { type: 'REMOVE_PARTICIPANT'; payload: string | number }
  | {
      type: 'UPDATE_PARTICIPANT';
      payload: { uid: string | number; updates: Partial<VideoCallParticipant> };
    }
  | { type: 'SET_RECORDINGS'; payload: Recording[] }
  | { type: 'ADD_RECORDING'; payload: Recording }
  | {
      type: 'UPDATE_RECORDING';
      payload: { id: string; updates: Partial<Recording> };
    }
  | { type: 'SET_TRANSCRIPTIONS'; payload: Transcription[] }
  | { type: 'ADD_TRANSCRIPTION'; payload: Transcription }
  | { type: 'SET_ERROR'; payload: string | null }
  | {
      type: 'SET_DEVICES';
      payload: { cameras: MediaDeviceInfo[]; microphones: MediaDeviceInfo[] };
    }
  | { type: 'SELECT_CAMERA'; payload: string }
  | { type: 'SELECT_MICROPHONE'; payload: string }
  | { type: 'SET_SPEECH_RECOGNITION'; payload: SpeechRecognitionService | null }
  | { type: 'SET_TRANSCRIPTION_ENABLED'; payload: boolean }
  | { type: 'SET_TRANSCRIBING'; payload: boolean }
  | { type: 'SET_TRANSCRIPTION_LANGUAGE'; payload: string }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: VideoCallState = {
  client: null,
  localVideoTrack: null,
  localAudioTrack: null,
  localScreenTrack: null,
  remoteUsers: [],
  isVideoEnabled: true,
  isAudioEnabled: true,
  isScreenSharing: false,
  isJoined: false,
  isConnecting: false,
  participants: [],
  recordings: [],
  transcriptions: [],
  error: null,
  availableCameras: [],
  availableMicrophones: [],
  speechRecognition: null,
  isTranscriptionEnabled: false,
  isTranscribing: false,
  transcriptionLanguage: 'en-US',
};

// Reducer
const videoCallReducer = (
  state: VideoCallState,
  action: VideoCallAction
): VideoCallState => {
  switch (action.type) {
    case 'SET_CLIENT':
      return { ...state, client: action.payload };

    case 'SET_LOCAL_VIDEO_TRACK':
      return { ...state, localVideoTrack: action.payload };

    case 'SET_LOCAL_AUDIO_TRACK':
      return { ...state, localAudioTrack: action.payload };

    case 'SET_LOCAL_SCREEN_TRACK':
      return { ...state, localScreenTrack: action.payload };

    case 'SET_REMOTE_USERS':
      return { ...state, remoteUsers: action.payload };

    case 'TOGGLE_VIDEO':
      return {
        ...state,
        isVideoEnabled:
          action.payload !== undefined ? action.payload : !state.isVideoEnabled,
      };

    case 'TOGGLE_AUDIO':
      return {
        ...state,
        isAudioEnabled:
          action.payload !== undefined ? action.payload : !state.isAudioEnabled,
      };

    case 'SET_SCREEN_SHARING':
      return { ...state, isScreenSharing: action.payload };

    case 'SET_JOINED':
      return { ...state, isJoined: action.payload };

    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };

    case 'SET_PARTICIPANTS':
      return { ...state, participants: action.payload };

    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [
          ...state.participants.filter((p) => p.uid !== action.payload.uid),
          action.payload,
        ],
      };

    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter(
          (p) => p.uid !== action.payload
        ),
      };

    case 'UPDATE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.map((p) =>
          p.uid === action.payload.uid ? { ...p, ...action.payload.updates } : p
        ),
      };

    case 'SET_RECORDINGS':
      return { ...state, recordings: action.payload };

    case 'ADD_RECORDING':
      return { ...state, recordings: [...state.recordings, action.payload] };

    case 'UPDATE_RECORDING':
      return {
        ...state,
        recordings: state.recordings.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload.updates } : r
        ),
      };

    case 'SET_TRANSCRIPTIONS':
      return { ...state, transcriptions: action.payload };

    case 'ADD_TRANSCRIPTION':
      return {
        ...state,
        transcriptions: [...state.transcriptions, action.payload],
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_DEVICES':
      return {
        ...state,
        availableCameras: action.payload.cameras,
        availableMicrophones: action.payload.microphones,
      };

    case 'SELECT_CAMERA':
      return { ...state, selectedCamera: action.payload };

    case 'SELECT_MICROPHONE':
      return { ...state, selectedMicrophone: action.payload };

    case 'SET_SPEECH_RECOGNITION':
      return { ...state, speechRecognition: action.payload };

    case 'SET_TRANSCRIPTION_ENABLED':
      return { ...state, isTranscriptionEnabled: action.payload };

    case 'SET_TRANSCRIBING':
      return { ...state, isTranscribing: action.payload };

    case 'SET_TRANSCRIPTION_LANGUAGE':
      return { ...state, transcriptionLanguage: action.payload };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
};

// Context
interface VideoCallContextValue extends VideoCallState {
  joinChannel: (config: VideoCallConfig) => Promise<void>;
  leaveChannel: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  toggleAudio: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  switchCamera: (deviceId: string) => Promise<void>;
  switchMicrophone: (deviceId: string) => Promise<void>;
  startRecording: (channelName: string) => Promise<void>;
  stopRecording: (channelName: string) => Promise<void>;
  addTranscription: (text: string, participantName?: string) => void;
  refreshDevices: () => Promise<void>;
  // Speech Recognition
  enableTranscription: () => void;
  disableTranscription: () => void;
  setTranscriptionLanguage: (language: string) => void;
}

const VideoCallContext = createContext<VideoCallContextValue | null>(null);

// Provider
interface VideoCallProviderProps {
  children: ReactNode;
  videoCallId?: string;
}

export const VideoCallProvider: React.FC<VideoCallProviderProps> = ({
  children,
  videoCallId,
}) => {
  const [state, dispatch] = useReducer(videoCallReducer, initialState);

  // Initialize Agora client
  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    dispatch({ type: 'SET_CLIENT', payload: client });

    // Setup event listeners
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);
    client.on('connection-state-changed', handleConnectionStateChanged);

    return () => {
      client.removeAllListeners();
      leaveChannel();
    };
  }, []);

  // Event handlers
  const handleUserPublished = useCallback(
    async (user: any, mediaType: 'audio' | 'video') => {
      if (state.client) {
        await state.client.subscribe(user, mediaType);

        dispatch({
          type: 'SET_REMOTE_USERS',
          payload: state.client.remoteUsers,
        });
        dispatch({
          type: 'UPDATE_PARTICIPANT',
          payload: {
            uid: user.uid,
            updates: {
              hasVideo: mediaType === 'video' ? true : undefined,
              hasAudio: mediaType === 'audio' ? true : undefined,
              videoTrack: user.videoTrack,
              audioTrack: user.audioTrack,
            },
          },
        });
      }
    },
    [state.client]
  );

  const handleUserUnpublished = useCallback(
    (user: any, mediaType: 'audio' | 'video') => {
      if (state.client) {
        dispatch({
          type: 'SET_REMOTE_USERS',
          payload: state.client.remoteUsers,
        });
        dispatch({
          type: 'UPDATE_PARTICIPANT',
          payload: {
            uid: user.uid,
            updates: {
              hasVideo: mediaType === 'video' ? false : undefined,
              hasAudio: mediaType === 'audio' ? false : undefined,
            },
          },
        });
      }
    },
    [state.client]
  );

  const handleUserJoined = useCallback((user: any) => {
    dispatch({
      type: 'ADD_PARTICIPANT',
      payload: {
        uid: user.uid,
        name: `User ${user.uid}`,
        hasVideo: false,
        hasAudio: false,
      },
    });
  }, []);

  const handleUserLeft = useCallback((user: any) => {
    dispatch({ type: 'REMOVE_PARTICIPANT', payload: user.uid });
  }, []);

  const handleConnectionStateChanged = useCallback(
    (curState: string, revState: string, reason?: string) => {
      console.log('Connection state changed:', curState, reason);
      if (curState === 'DISCONNECTED') {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Connection lost. Trying to reconnect...',
        });
      } else if (curState === 'CONNECTED') {
        dispatch({ type: 'SET_ERROR', payload: null });
      }
    },
    []
  );

  // Methods
  const joinChannel = useCallback(
    async (
      config: VideoCallConfig,
      initialVideoState = true,
      initialAudioState = true
    ) => {
      if (!state.client || state.isJoined) return;

      try {
        dispatch({ type: 'SET_CONNECTING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        // Create and publish local tracks
        const [audioTrack, videoTrack] = await Promise.all([
          AgoraRTC.createMicrophoneAudioTrack(),
          AgoraRTC.createCameraVideoTrack(),
        ]);

        // Set initial state based on preview settings
        await videoTrack.setEnabled(initialVideoState);
        await audioTrack.setEnabled(initialAudioState);

        dispatch({ type: 'SET_LOCAL_AUDIO_TRACK', payload: audioTrack });
        dispatch({ type: 'SET_LOCAL_VIDEO_TRACK', payload: videoTrack });
        dispatch({ type: 'TOGGLE_VIDEO', payload: initialVideoState });
        dispatch({ type: 'TOGGLE_AUDIO', payload: initialAudioState });

        // Join channel
        await state.client.join(
          config.appId,
          config.channelName,
          config.token,
          config.uid
        );

        // Publish tracks
        await state.client.publish([audioTrack, videoTrack]);

        dispatch({ type: 'SET_JOINED', payload: true });
        dispatch({ type: 'SET_CONNECTING', payload: false });

        // Add self as participant
        dispatch({
          type: 'ADD_PARTICIPANT',
          payload: {
            uid: config.uid,
            name: config.userName,
            profilePic: config.userProfilePic,
            hasVideo: initialVideoState,
            hasAudio: initialAudioState,
          },
        });

        // Join video call on backend
        await videoCallApi.joinVideoCall(config.channelName);
      } catch (error) {
        console.error('Error joining channel:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to join the video call',
        });
        dispatch({ type: 'SET_CONNECTING', payload: false });
        throw error;
      }
    },
    [state.client, state.isJoined]
  );

  const leaveChannel = useCallback(async () => {
    if (!state.client || !state.isJoined) return;

    try {
      // Stop local tracks
      if (state.localVideoTrack) {
        state.localVideoTrack.stop();
        state.localVideoTrack.close();
      }
      if (state.localAudioTrack) {
        state.localAudioTrack.stop();
        state.localAudioTrack.close();
      }
      if (state.localScreenTrack) {
        state.localScreenTrack.stop();
        state.localScreenTrack.close();
      }

      // Leave channel
      await state.client.leave();

      dispatch({ type: 'RESET_STATE' });
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  }, [
    state.client,
    state.isJoined,
    state.localVideoTrack,
    state.localAudioTrack,
    state.localScreenTrack,
  ]);

  const toggleVideo = useCallback(async () => {
    if (!state.localVideoTrack) return;

    try {
      if (state.isVideoEnabled) {
        await state.localVideoTrack.setEnabled(false);
      } else {
        await state.localVideoTrack.setEnabled(true);
      }
      dispatch({ type: 'TOGGLE_VIDEO' });
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  }, [state.localVideoTrack, state.isVideoEnabled]);

  const toggleAudio = useCallback(async () => {
    if (!state.localAudioTrack) return;

    try {
      if (state.isAudioEnabled) {
        await state.localAudioTrack.setEnabled(false);
      } else {
        await state.localAudioTrack.setEnabled(true);
      }
      dispatch({ type: 'TOGGLE_AUDIO' });
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  }, [state.localAudioTrack, state.isAudioEnabled]);

  const updateRecordingLayout = useCallback(
    async (isScreenSharing: boolean) => {
      if (!videoCallId) return;

      try {
        // Get current user UID and remote user UIDs
        const currentUserUid = state.client?.uid?.toString() || '0';
        const remoteUserUids = state.remoteUsers.map((user) =>
          user.uid.toString()
        );

        console.log('xxxxx Current UIDs for layout (Provider):', {
          currentUserUid,
          remoteUserUids,
          isScreenSharing,
          totalUsers: 1 + state.remoteUsers.length,
        });

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
          remoteUserUids.forEach((uid, index) => {
            layoutConfig.layoutConfig.push({
              uid: uid,
              x_axis: 0.7,
              y_axis: index * (1.0 / remoteUserUids.length),
              width: 0.3, // 30% width for participants
              height: 1.0 / remoteUserUids.length, // Split height among participants
              alpha: 1.0,
              render_mode: 1,
            });
          });
        } else {
          // Normal layout: equal split or grid
          const allUids = [currentUserUid, ...remoteUserUids];
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

        console.log('xxxxx Updating recording layout:', {
          isScreenSharing,
          layoutConfig,
        });
        await videoCallApi.updateRecordingLayout(videoCallId, layoutConfig);
        console.log('✅ Recording layout updated successfully');
      } catch (error) {
        console.error('❌ Failed to update recording layout:', error);
      }
    },
    [videoCallId, state.remoteUsers, state.client]
  );

  const toggleScreenShare = useCallback(async () => {
    if (!state.client) return;

    try {
      if (state.isScreenSharing) {
        // Stop screen sharing
        if (state.localScreenTrack) {
          await state.client.unpublish(state.localScreenTrack);
          state.localScreenTrack.stop();
          state.localScreenTrack.close();
          dispatch({ type: 'SET_LOCAL_SCREEN_TRACK', payload: null });
        }

        // Publish camera video again
        if (state.localVideoTrack) {
          await state.client.publish(state.localVideoTrack);
        }

        dispatch({ type: 'SET_SCREEN_SHARING', payload: false });

        // Update recording layout for normal view
        await updateRecordingLayout(false);
      } else {
        // Start screen sharing
        const screenTrack = await AgoraRTC.createScreenVideoTrack(
          {},
          'disable'
        );

        // Unpublish camera video
        if (state.localVideoTrack) {
          await state.client.unpublish(state.localVideoTrack);
        }

        // Publish screen track
        await state.client.publish(screenTrack);

        dispatch({ type: 'SET_LOCAL_SCREEN_TRACK', payload: screenTrack });
        dispatch({ type: 'SET_SCREEN_SHARING', payload: true });

        // Update recording layout for screen sharing
        await updateRecordingLayout(true);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to toggle screen sharing',
      });
    }
  }, [
    state.client,
    state.isScreenSharing,
    state.localScreenTrack,
    state.localVideoTrack,
    updateRecordingLayout,
  ]);

  const switchCamera = useCallback(
    async (deviceId: string) => {
      if (!state.localVideoTrack) return;

      try {
        await state.localVideoTrack.setDevice(deviceId);
        dispatch({ type: 'SELECT_CAMERA', payload: deviceId });
      } catch (error) {
        console.error('Error switching camera:', error);
      }
    },
    [state.localVideoTrack]
  );

  const switchMicrophone = useCallback(
    async (deviceId: string) => {
      if (!state.localAudioTrack) return;

      try {
        await state.localAudioTrack.setDevice(deviceId);
        dispatch({ type: 'SELECT_MICROPHONE', payload: deviceId });
      } catch (error) {
        console.error('Error switching microphone:', error);
      }
    },
    [state.localAudioTrack]
  );

  const startRecording = useCallback(async (channelName: string) => {
    try {
      const response = await videoCallApi.startRecording(channelName);
      dispatch({
        type: 'ADD_RECORDING',
        payload: {
          id: response.recordingId,
          status: 'STARTING',
          startedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to start recording' });
    }
  }, []);

  const stopRecording = useCallback(async (channelName: string) => {
    try {
      const response = await videoCallApi.stopRecording(channelName);
      dispatch({
        type: 'UPDATE_RECORDING',
        payload: {
          id: response.recordingId,
          updates: {
            status: 'COMPLETED',
            completedAt: new Date(),
            duration: response.duration,
          },
        },
      });
    } catch (error) {
      console.error('Error stopping recording:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to stop recording' });
    }
  }, []);

  const addTranscription = useCallback(
    (text: string, participantName?: string) => {
      dispatch({
        type: 'ADD_TRANSCRIPTION',
        payload: {
          id: `trans_${Date.now()}`,
          text,
          participantName,
          timestamp: new Date(),
        },
      });
    },
    []
  );

  const refreshDevices = useCallback(async () => {
    try {
      const devices = await AgoraRTC.getDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      const microphones = devices.filter(
        (device) => device.kind === 'audioinput'
      );

      dispatch({
        type: 'SET_DEVICES',
        payload: { cameras, microphones },
      });
    } catch (error) {
      console.error('Error getting devices:', error);
    }
  }, []);

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    const speechRecognition = new SpeechRecognitionService({
      language: state.transcriptionLanguage,
      continuous: true,
      interimResults: true,
    });

    dispatch({ type: 'SET_SPEECH_RECOGNITION', payload: speechRecognition });
  }, [state.transcriptionLanguage]);

  const enableTranscription = useCallback(() => {
    if (!state.speechRecognition) {
      initializeSpeechRecognition();
    }

    if (state.speechRecognition && !state.isTranscribing) {
      const success = state.speechRecognition.start({
        onStart: () => {
          dispatch({ type: 'SET_TRANSCRIBING', payload: true });
        },
        onEnd: () => {
          dispatch({ type: 'SET_TRANSCRIBING', payload: false });
        },
        onResult: (result: SpeechRecognitionResult) => {
          if (result.isFinal) {
            // Add final transcription
            const transcription: Transcription = {
              id: `speech_${Date.now()}`,
              text: result.text,
              participantName: 'You', // Current user
              timestamp: new Date(),
              confidence: result.confidence,
            };
            dispatch({ type: 'ADD_TRANSCRIPTION', payload: transcription });

            // Save to backend (optional - could be made configurable)
            // This could be called with the current channel name if available
          }
        },
        onError: (error) => {
          dispatch({ type: 'SET_ERROR', payload: error });
          dispatch({ type: 'SET_TRANSCRIBING', payload: false });
        },
      });

      if (success) {
        dispatch({ type: 'SET_TRANSCRIPTION_ENABLED', payload: true });
      }
    }
  }, [
    state.speechRecognition,
    state.isTranscribing,
    initializeSpeechRecognition,
  ]);

  const disableTranscription = useCallback(() => {
    if (state.speechRecognition && state.isTranscribing) {
      state.speechRecognition.stop();
    }
    dispatch({ type: 'SET_TRANSCRIPTION_ENABLED', payload: false });
    dispatch({ type: 'SET_TRANSCRIBING', payload: false });
  }, [state.speechRecognition, state.isTranscribing]);

  const setTranscriptionLanguage = useCallback(
    (language: string) => {
      // If transcription is active, restart with new language
      const wasTranscribing = state.isTranscribing;

      if (wasTranscribing) {
        disableTranscription();
      }

      dispatch({ type: 'SET_TRANSCRIPTION_LANGUAGE', payload: language });

      // Reinitialize with new language
      const speechRecognition = new SpeechRecognitionService({
        language,
        continuous: true,
        interimResults: true,
      });
      dispatch({ type: 'SET_SPEECH_RECOGNITION', payload: speechRecognition });

      // Restart if it was active
      if (wasTranscribing) {
        setTimeout(() => enableTranscription(), 100);
      }
    },
    [state.isTranscribing, disableTranscription, enableTranscription]
  );

  // Load devices and initialize speech recognition on mount
  useEffect(() => {
    refreshDevices();
    initializeSpeechRecognition();
  }, [refreshDevices, initializeSpeechRecognition]);

  const contextValue: VideoCallContextValue = {
    ...state,
    joinChannel,
    leaveChannel,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    switchCamera,
    switchMicrophone,
    startRecording,
    stopRecording,
    addTranscription,
    refreshDevices,
    enableTranscription,
    disableTranscription,
    setTranscriptionLanguage,
  };

  return (
    <VideoCallContext.Provider value={contextValue}>
      {children}
    </VideoCallContext.Provider>
  );
};

// Hook
export const useVideoCall = (): VideoCallContextValue => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
};

export default VideoCallProvider;
