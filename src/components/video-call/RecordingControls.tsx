'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import {
  Circle,
  Square,
  Download,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileVideo,
  Play,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu';

interface Recording {
  id: string;
  status: 'STARTING' | 'RECORDING' | 'STOPPING' | 'COMPLETED' | 'FAILED';
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  fileUrl?: string;
}

interface RecordingControlsProps {
  recordings: Recording[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  isHost?: boolean;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  recordings,
  onStartRecording,
  onStopRecording,
  isHost = true,
}) => {
  const [showRecordingList, setShowRecordingList] = useState(false);

  const activeRecording = recordings.find(
    (r) =>
      r.status === 'STARTING' ||
      r.status === 'RECORDING' ||
      r.status === 'STOPPING'
  );

  const completedRecordings = recordings.filter(
    (r) => r.status === 'COMPLETED'
  );

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '00:00';

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingStatusIcon = (status: Recording['status']) => {
    switch (status) {
      case 'STARTING':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'RECORDING':
        return <Circle className="h-4 w-4 text-red-500 animate-pulse" />;
      case 'STOPPING':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getRecordingStatusText = (status: Recording['status']) => {
    switch (status) {
      case 'STARTING':
        return 'Starting...';
      case 'RECORDING':
        return 'Recording';
      case 'STOPPING':
        return 'Stopping...';
      case 'COMPLETED':
        return 'Completed';
      case 'FAILED':
        return 'Failed';
    }
  };

  const handleDownload = (recording: Recording) => {
    if (recording.fileUrl) {
      window.open(recording.fileUrl, '_blank');
    }
  };

  if (!isHost) {
    return activeRecording ? (
      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="bg-red-600 text-white">
          <Circle className="h-3 w-3 mr-1 animate-pulse" />
          Recording
        </Badge>
      </div>
    ) : null;
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Recording Status */}
      {activeRecording && (
        <Badge
          variant="secondary"
          className={`${
            activeRecording.status === 'RECORDING'
              ? 'bg-red-600 text-white'
              : 'bg-yellow-600 text-white'
          }`}
        >
          {getRecordingStatusIcon(activeRecording.status)}
          <span className="ml-1">
            {getRecordingStatusText(activeRecording.status)}
          </span>
          {activeRecording.status === 'RECORDING' &&
            activeRecording.startedAt && (
              <span className="ml-2">
                <RecordingTimer startTime={activeRecording.startedAt} />
              </span>
            )}
        </Badge>
      )}

      {/* Recording Controls */}
      {!activeRecording ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onStartRecording}
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          <Circle className="h-4 w-4 mr-2" />
          Start Recording
        </Button>
      ) : (
        activeRecording.status === 'RECORDING' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onStopRecording}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        )
      )}

      {/* Recordings List Dropdown */}
      {completedRecordings.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FileVideo className="h-4 w-4 mr-2" />
              Recordings ({completedRecordings.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2">
              <p className="text-sm font-medium mb-2">Recorded Sessions</p>
              {completedRecordings.map((recording) => (
                <RecordingItem
                  key={recording.id}
                  recording={recording}
                  onDownload={() => handleDownload(recording)}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

// Recording Timer Component
interface RecordingTimerProps {
  startTime: Date;
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({ startTime }) => {
  const [duration, setDuration] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setDuration(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return <span className="font-mono text-sm">{formatTime(duration)}</span>;
};

// Recording Item Component
interface RecordingItemProps {
  recording: Recording;
  onDownload: () => void;
}

const RecordingItem: React.FC<RecordingItemProps> = ({
  recording,
  onDownload,
}) => {
  const formatDate = (date?: Date): string => {
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '00:00';

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <FileVideo className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium">
            Recording {recording.id.substring(0, 8)}
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
          <span>{formatDate(recording.startedAt)}</span>
          {recording.duration && (
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(recording.duration)}
            </span>
          )}
        </div>
      </div>

      {recording.fileUrl && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          className="text-blue-600 hover:text-blue-800"
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

// Recording Status Display Component
interface RecordingStatusDisplayProps {
  recordings: Recording[];
}

export const RecordingStatusDisplay: React.FC<RecordingStatusDisplayProps> = ({
  recordings,
}) => {
  const activeRecording = recordings.find(
    (r) =>
      r.status === 'STARTING' ||
      r.status === 'RECORDING' ||
      r.status === 'STOPPING'
  );

  if (!activeRecording) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-red-600 text-white border-red-700 shadow-lg">
        <div className="flex items-center space-x-3 px-4 py-2">
          <div className="flex items-center space-x-2">
            {activeRecording.status === 'RECORDING' ? (
              <Circle className="h-4 w-4 animate-pulse" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <span className="font-medium">
              {activeRecording.status === 'RECORDING'
                ? 'Recording in progress'
                : 'Processing...'}
            </span>
          </div>

          {activeRecording.status === 'RECORDING' &&
            activeRecording.startedAt && (
              <RecordingTimer startTime={activeRecording.startedAt} />
            )}
        </div>
      </Card>
    </div>
  );
};

export default RecordingControls;
