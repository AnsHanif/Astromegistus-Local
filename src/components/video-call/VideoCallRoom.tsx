'use client';

import React, { useState, useEffect } from 'react';
import { VideoCallInterface, VideoCallConfig } from './VideoCallInterface';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Video, 
  Users, 
  Settings, 
  Copy, 
  ExternalLink,
  Crown,
  Clock,
  Play
} from 'lucide-react';
import { videoCallApi } from '../../services/video-call-api';
import { useRouter } from 'next/navigation';

// Types
interface VideoCallRoomProps {
  // For joining an existing call
  channelName?: string;
  
  // For creating a new call
  coachingBookingId?: string;
  
  // User information
  userName: string;
  userId: string;
  userProfilePic?: string;
  isHost?: boolean;
  
  // Callbacks
  onExit?: () => void;
  onError?: (error: string) => void;
}

interface JoinCallFormProps {
  onJoin: (channelName: string) => void;
  onCreateNew: () => void;
  isLoading: boolean;
  userName: string;
}

const JoinCallForm: React.FC<JoinCallFormProps> = ({
  onJoin,
  onCreateNew,
  isLoading,
  userName
}) => {
  const [channelName, setChannelName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (channelName.trim()) {
      onJoin(channelName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <div className="p-6">
          <div className="text-center mb-6">
            <Video className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Join Video Call
            </h1>
            <p className="text-gray-400">
              Welcome, {userName}
            </p>
          </div>

          {/* Join existing call */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Call ID or Channel Name
              </label>
              <Input
                type="text"
                placeholder="Enter call ID..."
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={!channelName.trim() || isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Call'}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-800 px-2 text-gray-400">or</span>
            </div>
          </div>

          {/* Create new call */}
          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={onCreateNew}
            disabled={isLoading}
          >
            <Users className="h-4 w-4 mr-2" />
            Start New Call
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Pre-call setup component
interface PreCallSetupProps {
  config: VideoCallConfig;
  onJoinCall: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const PreCallSetup: React.FC<PreCallSetupProps> = ({
  config,
  onJoinCall,
  onCancel,
  isLoading
}) => {
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false
  });
  const [isCheckingDevices, setIsCheckingDevices] = useState(true);

  useEffect(() => {
    checkDevicePermissions();
  }, []);

  const checkDevicePermissions = async () => {
    try {
      setIsCheckingDevices(true);
      
      // Request permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setDevicePermissions({
        camera: true,
        microphone: true
      });
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error checking device permissions:', error);
      setDevicePermissions({
        camera: false,
        microphone: false
      });
    } finally {
      setIsCheckingDevices(false);
    }
  };

  const copyChannelName = async () => {
    try {
      await navigator.clipboard.writeText(config.channelName);
      // Could show a toast notification here
    } catch (err) {
      console.error('Failed to copy channel name:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <div className="p-6">
          <div className="text-center mb-6">
            <Video className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Ready to Join Call?
            </h1>
            <p className="text-gray-400">
              Check your settings before joining
            </p>
          </div>

          {/* Call Information */}
          <Card className="bg-gray-700 border-gray-600 mb-6">
            <div className="p-4">
              <h3 className="text-white font-medium mb-3">Call Details</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Call ID:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-600 px-2 py-1 rounded text-white">
                      {config.channelName}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyChannelName}
                      className="p-1 h-auto text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Your Name:</span>
                  <span className="text-white">{config.userName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Role:</span>
                  <Badge variant={config.isHost ? "default" : "secondary"}>
                    {config.isHost ? (
                      <>
                        <Crown className="h-3 w-3 mr-1" />
                        Host
                      </>
                    ) : (
                      'Participant'
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Device Check */}
          <Card className="bg-gray-700 border-gray-600 mb-6">
            <div className="p-4">
              <h3 className="text-white font-medium mb-3">Device Check</h3>
              
              {isCheckingDevices ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-gray-300">Checking devices...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Camera:</span>
                    <Badge variant={devicePermissions.camera ? "default" : "destructive"}>
                      {devicePermissions.camera ? '✓ Allowed' : '✗ Denied'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Microphone:</span>
                    <Badge variant={devicePermissions.microphone ? "default" : "destructive"}>
                      {devicePermissions.microphone ? '✓ Allowed' : '✗ Denied'}
                    </Badge>
                  </div>
                  
                  {(!devicePermissions.camera || !devicePermissions.microphone) && (
                    <div className="mt-3 p-3 bg-yellow-900 border border-yellow-700 rounded">
                      <p className="text-yellow-200 text-sm">
                        Please allow camera and microphone permissions for the best experience.
                        <Button
                          variant="link"
                          size="sm"
                          onClick={checkDevicePermissions}
                          className="text-yellow-200 underline p-0 h-auto ml-2"
                        >
                          Try Again
                        </Button>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            
            <Button 
              onClick={onJoinCall}
              disabled={isLoading || isCheckingDevices}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Joining...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Join Call
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Main VideoCallRoom component
export const VideoCallRoom: React.FC<VideoCallRoomProps> = ({
  channelName,
  coachingBookingId,
  userName,
  userId,
  userProfilePic,
  isHost = false,
  onExit,
  onError
}) => {
  const [currentStep, setCurrentStep] = useState<'join-form' | 'pre-call' | 'in-call'>('join-form');
  const [videoCallConfig, setVideoCallConfig] = useState<VideoCallConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // If channelName is provided, skip to pre-call setup
  useEffect(() => {
    if (channelName) {
      handleJoinExistingCall(channelName);
    }
  }, [channelName]);

  const handleJoinExistingCall = async (channel: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Join the video call via API
      const response = await videoCallApi.joinVideoCall(channel);

      const config: VideoCallConfig = {
        channelName: channel,
        token: response.token,
        appId: response.appId,
        uid: parseInt(userId.replace(/[^0-9]/g, '').slice(-9) || '123456789'),
        userName,
        userProfilePic,
        isHost: response.videoCall.hostUserId === userId
      };

      setVideoCallConfig(config);
      setCurrentStep('pre-call');

    } catch (error: any) {
      console.error('Error joining call:', error);
      const errorMessage = error.response?.data?.message || 'Failed to join video call';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewCall = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create a new video call via API
      const response = await videoCallApi.createVideoCall(
        coachingBookingId ? { coachingBookingId } : undefined
      );

      const config: VideoCallConfig = {
        channelName: response.videoCall.channelName,
        token: response.token,
        appId: response.appId,
        uid: parseInt(userId.replace(/[^0-9]/g, '').slice(-9) || '123456789'),
        userName,
        userProfilePic,
        isHost: true
      };

      setVideoCallConfig(config);
      setCurrentStep('pre-call');

    } catch (error: any) {
      console.error('Error creating call:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create video call';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCall = () => {
    setCurrentStep('in-call');
  };

  const handleLeaveCall = async () => {
    if (videoCallConfig) {
      try {
        await videoCallApi.leaveVideoCall(videoCallConfig.channelName);
      } catch (error) {
        console.error('Error leaving call:', error);
      }
    }
    
    onExit ? onExit() : router.back();
  };

  const handleCallError = (error: string) => {
    setError(error);
    onError?.(error);
  };

  // Error display
  if (error && currentStep !== 'in-call') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <div className="p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">
              Connection Error
            </h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  setError(null);
                  setCurrentStep('join-form');
                }}
                className="w-full"
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLeaveCall}
                className="w-full border-gray-600 text-gray-300"
              >
                Go Back
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Render based on current step
  switch (currentStep) {
    case 'join-form':
      return (
        <JoinCallForm
          onJoin={handleJoinExistingCall}
          onCreateNew={handleCreateNewCall}
          isLoading={isLoading}
          userName={userName}
        />
      );

    case 'pre-call':
      if (!videoCallConfig) return null;
      return (
        <PreCallSetup
          config={videoCallConfig}
          onJoinCall={handleJoinCall}
          onCancel={handleLeaveCall}
          isLoading={isLoading}
        />
      );

    case 'in-call':
      if (!videoCallConfig) return null;
      return (
        <VideoCallInterface
          config={videoCallConfig}
          onLeave={handleLeaveCall}
          onError={handleCallError}
        />
      );

    default:
      return null;
  }
};

export default VideoCallRoom;
