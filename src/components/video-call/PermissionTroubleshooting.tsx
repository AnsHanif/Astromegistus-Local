import React, { useState, useEffect } from 'react';
import {
  checkPermissionStatus,
  getDeviceInfo,
  getBrowserInstructions,
  checkWebRTCSupport,
} from '../../utils/permissionUtils';

interface PermissionTroubleshootingProps {
  onRetry: () => void;
  onClose: () => void;
}

export const PermissionTroubleshooting: React.FC<
  PermissionTroubleshootingProps
> = ({ onRetry, onClose }) => {
  const [permissionStatus, setPermissionStatus] = useState<any>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [webRTCSupport, setWebRTCSupport] = useState<any>(null);
  const [browserInstructions, setBrowserInstructions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      try {
        const [permissions, devices, support, instructions] = await Promise.all(
          [
            checkPermissionStatus(),
            getDeviceInfo(),
            checkWebRTCSupport(),
            Promise.resolve(getBrowserInstructions()),
          ]
        );

        setPermissionStatus(permissions);
        setDeviceInfo(devices);
        setWebRTCSupport(support);
        setBrowserInstructions(instructions);
      } catch (error) {
        console.error('Error checking status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-700">Checking permissions...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Camera & Microphone Troubleshooting
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* WebRTC Support */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Browser Support
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${webRTCSupport?.supported ? 'bg-green-500' : 'bg-red-500'}`}
                ></div>
                <span className="font-medium">
                  {webRTCSupport?.supported
                    ? 'WebRTC Supported'
                    : 'WebRTC Not Supported'}
                </span>
              </div>
              <div className="text-sm text-gray-600 ml-6">
                <div>
                  getUserMedia:{' '}
                  {webRTCSupport?.features?.getUserMedia ? '✅' : '❌'}
                </div>
                <div>
                  RTCPeerConnection:{' '}
                  {webRTCSupport?.features?.RTCPeerConnection ? '✅' : '❌'}
                </div>
                <div>
                  MediaDevices:{' '}
                  {webRTCSupport?.features?.mediaDevices ? '✅' : '❌'}
                </div>
              </div>
            </div>
          </div>

          {/* Device Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Device Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${deviceInfo?.hasCamera ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  <span>Camera: {deviceInfo?.cameraCount || 0} found</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${deviceInfo?.hasMicrophone ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  <span>
                    Microphone: {deviceInfo?.microphoneCount || 0} found
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Permission Status */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Permission Status
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      permissionStatus?.camera === 'granted'
                        ? 'bg-green-500'
                        : permissionStatus?.camera === 'denied'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                    }`}
                  ></div>
                  <span>Camera: {permissionStatus?.camera || 'unknown'}</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      permissionStatus?.microphone === 'granted'
                        ? 'bg-green-500'
                        : permissionStatus?.microphone === 'denied'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                    }`}
                  ></div>
                  <span>
                    Microphone: {permissionStatus?.microphone || 'unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Instructions */}
          {browserInstructions && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Instructions for {browserInstructions.browser}
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  {browserInstructions.instructions.map(
                    (instruction: string, index: number) => (
                      <li key={index}>{instruction}</li>
                    )
                  )}
                </ol>
                <div className="mt-4">
                  <a
                    href={browserInstructions.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View detailed help guide →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Common Solutions */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Common Solutions
            </h3>
            <div className="bg-yellow-50 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>
                  Make sure no other applications are using your camera or
                  microphone
                </li>
                <li>Check if your camera/microphone is physically connected</li>
                <li>Try refreshing the page after allowing permissions</li>
                <li>Clear your browser cache and cookies</li>
                <li>Try using a different browser</li>
                <li>Check your browser's privacy settings</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onRetry}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
