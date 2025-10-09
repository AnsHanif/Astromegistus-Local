'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MonitorSpeaker, 
  Monitor, 
  Maximize, 
  Minimize,
  Settings,
  Phone,
  PhoneOff
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { useVideoCall } from './VideoCallProvider';

interface VideoCallControlsProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onToggleScreenShare: () => void;
  onFullScreen?: () => void;
  isFullScreen?: boolean;
  onLeave?: () => void;
}

export const VideoCallControls: React.FC<VideoCallControlsProps> = ({
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onFullScreen,
  isFullScreen = false,
  onLeave
}) => {
  const { 
    availableCameras, 
    availableMicrophones, 
    switchCamera, 
    switchMicrophone,
    refreshDevices 
  } = useVideoCall();
  
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);

  const handleDeviceRefresh = async () => {
    await refreshDevices();
  };

  return (
    <div className="flex items-center justify-center space-x-3">
      {/* Audio Control */}
      <div className="relative">
        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="lg"
          onClick={onToggleAudio}
          className="rounded-full w-12 h-12 p-0"
          title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          {isAudioEnabled ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>
        
        {/* Microphone Selection */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-1 -right-1 w-6 h-6 p-0 bg-gray-700 hover:bg-gray-600 rounded-full"
              onClick={handleDeviceRefresh}
            >
              <Settings className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <div className="p-2">
              <p className="text-sm font-medium mb-2">Select Microphone</p>
              {availableMicrophones.length > 0 ? (
                availableMicrophones.map((device) => (
                  <DropdownMenuItem
                    key={device.deviceId}
                    onClick={() => switchMicrophone(device.deviceId)}
                    className="cursor-pointer"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    {device.label || `Microphone ${device.deviceId.substring(0, 8)}`}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No microphones found
                </DropdownMenuItem>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Video Control */}
      <div className="relative">
        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="lg"
          onClick={onToggleVideo}
          className="rounded-full w-12 h-12 p-0"
          title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {isVideoEnabled ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>
        
        {/* Camera Selection */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-1 -right-1 w-6 h-6 p-0 bg-gray-700 hover:bg-gray-600 rounded-full"
              onClick={handleDeviceRefresh}
            >
              <Settings className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <div className="p-2">
              <p className="text-sm font-medium mb-2">Select Camera</p>
              {availableCameras.length > 0 ? (
                availableCameras.map((device) => (
                  <DropdownMenuItem
                    key={device.deviceId}
                    onClick={() => switchCamera(device.deviceId)}
                    className="cursor-pointer"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {device.label || `Camera ${device.deviceId.substring(0, 8)}`}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No cameras found
                </DropdownMenuItem>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Screen Share Control */}
      <Button
        variant={isScreenSharing ? "secondary" : "outline"}
        size="lg"
        onClick={onToggleScreenShare}
        className="rounded-full w-12 h-12 p-0"
        title={isScreenSharing ? "Stop screen sharing" : "Share screen"}
      >
        {isScreenSharing ? (
          <MonitorSpeaker className="h-5 w-5" />
        ) : (
          <Monitor className="h-5 w-5" />
        )}
      </Button>

      {/* Full Screen Control */}
      {onFullScreen && (
        <Button
          variant="outline"
          size="lg"
          onClick={onFullScreen}
          className="rounded-full w-12 h-12 p-0"
          title={isFullScreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullScreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Leave Call Control */}
      {onLeave && (
        <Button
          variant="destructive"
          size="lg"
          onClick={onLeave}
          className="rounded-full w-12 h-12 p-0 bg-red-600 hover:bg-red-700"
          title="Leave call"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

// Device Settings Modal Component
interface DeviceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceSettingsModal: React.FC<DeviceSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    availableCameras, 
    availableMicrophones, 
    selectedCamera,
    selectedMicrophone,
    switchCamera, 
    switchMicrophone,
    refreshDevices 
  } = useVideoCall();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Device Settings</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            ×
          </Button>
        </div>

        <div className="space-y-4">
          {/* Camera Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Camera</label>
            <select
              value={selectedCamera || ''}
              onChange={(e) => switchCamera(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Camera</option>
              {availableCameras.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.substring(0, 8)}`}
                </option>
              ))}
            </select>
          </div>

          {/* Microphone Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Microphone</label>
            <select
              value={selectedMicrophone || ''}
              onChange={(e) => switchMicrophone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Microphone</option>
              {availableMicrophones.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId.substring(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={refreshDevices}
          >
            Refresh Devices
          </Button>
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallControls;
