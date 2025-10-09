/**
 * Utility functions for handling camera and microphone permissions
 */

export interface PermissionStatus {
  camera: PermissionState | 'unknown';
  microphone: PermissionState | 'unknown';
  hasDevices: boolean;
  error?: string;
}

export interface DeviceInfo {
  hasCamera: boolean;
  hasMicrophone: boolean;
  cameraCount: number;
  microphoneCount: number;
}

/**
 * Check current permission status for camera and microphone
 */
export async function checkPermissionStatus(): Promise<PermissionStatus> {
  try {
    // Check if permissions API is supported
    if (!navigator.permissions) {
      return {
        camera: 'unknown',
        microphone: 'unknown',
        hasDevices: false,
        error: 'Permission API not supported in this browser',
      };
    }

    // Query permissions
    const [cameraPermission, microphonePermission] = await Promise.all([
      navigator.permissions.query({ name: 'camera' as PermissionName }),
      navigator.permissions.query({ name: 'microphone' as PermissionName }),
    ]);

    // Check if devices are available
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasDevices = devices.some(
      (device) => device.kind === 'videoinput' || device.kind === 'audioinput'
    );

    return {
      camera: cameraPermission.state,
      microphone: microphonePermission.state,
      hasDevices,
    };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return {
      camera: 'unknown',
      microphone: 'unknown',
      hasDevices: false,
      error: 'Failed to check permissions',
    };
  }
}

/**
 * Get device information
 */
export async function getDeviceInfo(): Promise<DeviceInfo> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const microphones = devices.filter(
      (device) => device.kind === 'audioinput'
    );

    return {
      hasCamera: cameras.length > 0,
      hasMicrophone: microphones.length > 0,
      cameraCount: cameras.length,
      microphoneCount: microphones.length,
    };
  } catch (error) {
    console.error('Error getting device info:', error);
    return {
      hasCamera: false,
      hasMicrophone: false,
      cameraCount: 0,
      microphoneCount: 0,
    };
  }
}

/**
 * Request camera and microphone permissions
 */
export async function requestPermissions(): Promise<{
  success: boolean;
  error?: string;
  stream?: MediaStream;
}> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user',
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    // Stop the stream immediately as we just needed to check permissions
    stream.getTracks().forEach((track) => track.stop());

    return {
      success: true,
      stream,
    };
  } catch (error: any) {
    console.error('Permission request failed:', error);

    let errorMessage = '';
    if (error.name === 'NotAllowedError') {
      errorMessage =
        'Camera and microphone access denied. Please allow permissions and try again.';
    } else if (error.name === 'NotFoundError') {
      errorMessage =
        'No camera or microphone found. Please connect devices and try again.';
    } else if (error.name === 'NotReadableError') {
      errorMessage =
        'Camera or microphone is being used by another application.';
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = 'Camera or microphone constraints not supported.';
    } else {
      errorMessage = `Permission error: ${error.message}`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get browser-specific permission instructions
 */
export function getBrowserInstructions(): {
  browser: string;
  instructions: string[];
  helpUrl: string;
} {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) {
    return {
      browser: 'Chrome',
      instructions: [
        'Click the camera icon in the address bar',
        'Select "Allow" for camera and microphone',
        'Refresh the page and try again',
      ],
      helpUrl: 'https://support.google.com/chrome/answer/2693767',
    };
  } else if (/firefox/i.test(userAgent)) {
    return {
      browser: 'Firefox',
      instructions: [
        'Click the camera icon in the address bar',
        'Select "Allow" for camera and microphone',
        'Refresh the page and try again',
      ],
      helpUrl:
        'https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions',
    };
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    return {
      browser: 'Safari',
      instructions: [
        'Go to Safari > Settings for this Website',
        'Allow Camera and Microphone',
        'Refresh the page and try again',
      ],
      helpUrl: 'https://support.apple.com/guide/safari/websites-ibrw1015/mac',
    };
  } else if (/edge/i.test(userAgent)) {
    return {
      browser: 'Edge',
      instructions: [
        'Click the camera icon in the address bar',
        'Select "Allow" for camera and microphone',
        'Refresh the page and try again',
      ],
      helpUrl:
        'https://support.microsoft.com/en-us/microsoft-edge/allow-or-block-camera-and-microphone-access-in-microsoft-edge-5b0a4a0b-0b0a-4a0b-0b0a-4a0b0b0a4a0b',
    };
  } else {
    return {
      browser: 'Unknown',
      instructions: [
        'Allow camera and microphone permissions',
        'Refresh the page and try again',
        'Check browser settings',
      ],
      helpUrl:
        'https://www.wikihow.com/Enable-Camera-and-Microphone-Permissions-in-Your-Browser',
    };
  }
}

/**
 * Check if WebRTC is supported
 */
export function checkWebRTCSupport(): {
  supported: boolean;
  features: {
    getUserMedia: boolean;
    RTCPeerConnection: boolean;
    mediaDevices: boolean;
  };
} {
  const features = {
    getUserMedia: !!(
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    ),
    RTCPeerConnection: !!(
      window.RTCPeerConnection || (window as any).webkitRTCPeerConnection
    ),
    mediaDevices: !!navigator.mediaDevices,
  };

  return {
    supported: features.getUserMedia && features.RTCPeerConnection,
    features,
  };
}
