'use client';

import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import { VideoCallControls } from './VideoCallControls';
import { ParticipantList } from './ParticipantList';
import { RecordingControls } from './RecordingControls';
import { TranscriptionDisplay } from './TranscriptionDisplay';
import { VideoCallProvider, useVideoCall } from './VideoCallProvider';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { X, Users, MessageSquare } from 'lucide-react';

// Types
export interface VideoCallParticipant {
  uid: string | number;
  name: string;
  profilePic?: string;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
  hasVideo: boolean;
  hasAudio: boolean;
}

export interface VideoCallConfig {
  channelName: string;
  token: string;
  appId: string;
  uid: string | number;
  userName: string;
  userProfilePic?: string;
  isHost?: boolean;
}

interface VideoCallInterfaceProps {
  config: VideoCallConfig;
  onLeave: () => void;
  onError: (error: string) => void;
}

const VideoCallContent: React.FC<VideoCallInterfaceProps> = ({
  config,
  onLeave,
  onError
}) => {
  const {
    client,
    localVideoTrack,
    localAudioTrack,
    remoteUsers,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    isJoined,
    isConnecting,
    participants,
    recordings,
    transcriptions,
    joinChannel,
    leaveChannel,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    startRecording,
    stopRecording
  } = useVideoCall();

  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement>(null);

  // Initialize and join channel
  useEffect(() => {
    if (!isJoined && !isConnecting) {
      joinChannel(config);
    }

    return () => {
      if (isJoined) {
        leaveChannel();
      }
    };
  }, [config, isJoined, isConnecting]);

  // Handle local video track
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
    }
    
    return () => {
      if (localVideoTrack) {
        localVideoTrack.stop();
      }
    };
  }, [localVideoTrack]);

  // Handle remote video tracks
  useEffect(() => {
    remoteUsers.forEach((user) => {
      if (user.videoTrack) {
        const remoteVideoElement = document.getElementById(`remote-video-${user.uid}`);
        if (remoteVideoElement) {
          user.videoTrack.play(remoteVideoElement);
        }
      }
    });
  }, [remoteUsers]);

  const handleLeave = async () => {
    try {
      await leaveChannel();
      onLeave();
    } catch (error) {
      console.error('Error leaving channel:', error);
      onError('Failed to leave the call');
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white text-lg">Joining video call...</p>
        </div>
      </div>
    );
  }

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Failed to join the video call</p>
          <Button onClick={handleLeave} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen bg-gray-900 ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <h1 className="text-white text-lg font-semibold">
            Video Call - {config.channelName}
          </h1>
          {config.isHost && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
              Host
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className="text-white hover:bg-gray-700"
          >
            <Users className="h-4 w-4 mr-2" />
            {participants.length}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="text-white hover:bg-gray-700"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeave}
            className="text-red-400 hover:bg-red-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {/* Remote Videos Grid */}
          <div 
            ref={remoteVideoContainerRef}
            className="h-full grid gap-2 p-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(remoteUsers.length || 1, 3)}, 1fr)`,
              gridTemplateRows: `repeat(${Math.ceil(remoteUsers.length / 3)}, 1fr)`
            }}
          >
            {remoteUsers.length > 0 ? (
              remoteUsers.map((user) => (
                <Card key={user.uid} className="relative bg-gray-800 border-gray-700 overflow-hidden">
                  <div 
                    id={`remote-video-${user.uid}`}
                    className="w-full h-full bg-gray-700"
                  />
                  {!user.hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                      <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {participants.find(p => p.uid === user.uid)?.name?.[0] || 'U'}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                    {participants.find(p => p.uid === user.uid)?.name || `User ${user.uid}`}
                  </div>
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    {!user.hasAudio && (
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🔇</span>
                      </div>
                    )}
                    {!user.hasVideo && (
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">📹</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center">
                <p className="text-gray-400">Waiting for other participants to join...</p>
              </div>
            )}
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <Card className="absolute bottom-20 right-4 w-48 h-36 bg-gray-800 border-gray-700 overflow-hidden">
            <div 
              ref={localVideoRef}
              className="w-full h-full bg-gray-700"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {config.userName?.[0] || 'Y'}
                  </span>
                </div>
              </div>
            )}
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white px-1 py-0.5 rounded text-xs">
              You
            </div>
            <div className="absolute bottom-1 right-1 flex space-x-1">
              {!isAudioEnabled && (
                <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔇</span>
                </div>
              )}
              {!isVideoEnabled && (
                <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📹</span>
                </div>
              )}
            </div>
          </Card>

          {/* Full Screen Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullScreen}
            className="absolute top-4 right-4 text-white hover:bg-gray-700"
          >
            {isFullScreen ? '⤥' : '⤢'}
          </Button>
        </div>

        {/* Sidebar */}
        {(showParticipants || showChat) && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {showParticipants && (
              <div className="flex-1">
                <ParticipantList participants={participants} />
              </div>
            )}
            
            {showChat && (
              <div className="flex-1 border-t border-gray-700">
                <TranscriptionDisplay transcriptions={transcriptions} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-center space-x-4">
          <VideoCallControls
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            isScreenSharing={isScreenSharing}
            onToggleVideo={toggleVideo}
            onToggleAudio={toggleAudio}
            onToggleScreenShare={toggleScreenShare}
            onFullScreen={toggleFullScreen}
            isFullScreen={isFullScreen}
          />
          
          {config.isHost && (
            <RecordingControls
              recordings={recordings}
              onStartRecording={() => startRecording(config.channelName)}
              onStopRecording={() => stopRecording(config.channelName)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Main component with provider
export const VideoCallInterface: React.FC<VideoCallInterfaceProps> = (props) => {
  return (
    <VideoCallProvider>
      <VideoCallContent {...props} />
    </VideoCallProvider>
  );
};

export default VideoCallInterface;
