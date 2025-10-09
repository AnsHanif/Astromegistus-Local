'use client';

import Image from 'next/image';

// SVG icons as image sources
const HANGING_CALL_ICON = '/svg/hanging-call.svg';
const MIC_ICON = '/svg/mic.svg';
const MIC_OFF_ICON = '/svg/mic-off.svg';
const VIDEO_CALL_ICON = '/svg/video-call.svg';
const VIDEO_CALL_OFF_ICON = '/svg/video-call-off.svg';

interface ControlsProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isHost: boolean;
  isScreenShareLoading?: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onToggleScreenShare: () => void;
  onLeaveCall: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
  isHost,
  isScreenShareLoading = false,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onLeaveCall,
}) => {
  return (
    <div className="glass-effect px-6 py-4 flex items-center justify-center space-x-4 border-t border-white/10">
      {/* Video Toggle */}
      <button
        onClick={onToggleVideo}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isVideoEnabled
            ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-white'
            : 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-white'
        }`}
        title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        <Image
          src={isVideoEnabled ? VIDEO_CALL_ICON : VIDEO_CALL_OFF_ICON}
          alt={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          width={28}
          height={28}
          className="w-7 h-7"
        />
      </button>

      {/* Audio Toggle */}
      <button
        onClick={onToggleAudio}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isAudioEnabled
            ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-white'
            : 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-white'
        }`}
        title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
      >
        <Image
          src={isAudioEnabled ? MIC_ICON : MIC_OFF_ICON}
          alt={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
          width={28}
          height={28}
          className="w-7 h-7"
        />
      </button>

      {/* Screen Share Toggle */}
      <button
        onClick={onToggleScreenShare}
        disabled={isScreenShareLoading}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isScreenShareLoading
            ? 'bg-gray-500 cursor-not-allowed text-white'
            : isScreenSharing
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-white hover:opacity-90'
        }`}
        title={
          isScreenShareLoading
            ? 'Processing...'
            : isScreenSharing
              ? 'Stop sharing screen'
              : 'Share screen'
        }
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {isScreenShareLoading ? (
            // Loading spinner
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isScreenSharing ? (
            // Stop screen share icon
            <img
              src="/svg/stop-screen-share.svg"
              alt="Stop screen share"
              className="w-5 h-5"
            />
          ) : (
            // Screen share icon
            <img
              src="/svg/screen-share.svg"
              alt="Share screen"
              className="w-5 h-5"
            />
          )}
        </div>
      </button>

      {/* Leave Call */}
      <button
        onClick={onLeaveCall}
        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-lg"
        title="Leave call"
      >
        <Image
          src={HANGING_CALL_ICON}
          alt="Leave call"
          width={28}
          height={28}
          className="w-7 h-7"
        />
      </button>
    </div>
  );
};

interface PreJoinControlsProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
}

export const PreJoinControls: React.FC<PreJoinControlsProps> = ({
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
}) => {
  console.log('🔍 PreJoinControls rendered:', {
    isVideoEnabled,
    isAudioEnabled,
  });

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-50">
      {/* Microphone Button */}
      <button
        onClick={onToggleAudio}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          isAudioEnabled
            ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark hover:from-golden-glow-dark hover:via-pink-shade hover:to-golden-glow shadow-lg'
            : 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark hover:from-golden-glow-dark hover:via-pink-shade hover:to-golden-glow shadow-lg'
        }`}
      >
        <Image
          src={isAudioEnabled ? MIC_ICON : MIC_OFF_ICON}
          alt={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </button>

      {/* Camera Button */}
      <button
        onClick={onToggleVideo}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          isVideoEnabled
            ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark hover:from-golden-glow-dark hover:via-pink-shade hover:to-golden-glow shadow-lg'
            : 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark hover:from-golden-glow-dark hover:via-pink-shade hover:to-golden-glow shadow-lg'
        }`}
      >
        <Image
          src={isVideoEnabled ? VIDEO_CALL_ICON : VIDEO_CALL_OFF_ICON}
          alt={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </button>
    </div>
  );
};
