'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  MessageSquare, 
  Download, 
  Copy, 
  Search, 
  Trash2,
  Volume2,
  VolumeX,
  Settings,
  User,
  Clock,
  Languages
} from 'lucide-react';
import { Input } from '../ui/input';
import { useVideoCall } from './VideoCallProvider';
import { SpeechRecognitionService } from '../../services/speech-recognition';

interface Transcription {
  id: string;
  text: string;
  participantName?: string;
  timestamp: Date;
  confidence?: number;
}

interface TranscriptionDisplayProps {
  transcriptions: Transcription[];
  onAddTranscription?: (text: string, participantName?: string) => void;
  isLiveTranscriptionEnabled?: boolean;
  onToggleLiveTranscription?: () => void;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcriptions,
  onAddTranscription,
  isLiveTranscriptionEnabled: propIsLiveEnabled,
  onToggleLiveTranscription: propOnToggle
}) => {
  const {
    isTranscriptionEnabled,
    isTranscribing,
    transcriptionLanguage,
    enableTranscription,
    disableTranscription,
    setTranscriptionLanguage
  } = useVideoCall();

  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const transcriptionEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use context values if available, otherwise fall back to props
  const isLiveTranscriptionEnabled = isTranscriptionEnabled ?? propIsLiveEnabled ?? false;
  const onToggleLiveTranscription = propOnToggle || (() => {
    if (isTranscriptionEnabled) {
      disableTranscription();
    } else {
      enableTranscription();
    }
  });

  // Auto-scroll to bottom when new transcriptions arrive
  useEffect(() => {
    if (transcriptionEndRef.current) {
      transcriptionEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcriptions]);

  const filteredTranscriptions = React.useMemo(() => {
    if (!searchTerm) return transcriptions;
    
    return transcriptions.filter(t => 
      t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.participantName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transcriptions, searchTerm]);

  const formatTime = (timestamp: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp);
  };

  const exportTranscriptions = () => {
    const content = transcriptions
      .map(t => `[${formatTime(t.timestamp)}] ${t.participantName || 'Unknown'}: ${t.text}`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyAllTranscriptions = async () => {
    const content = transcriptions
      .map(t => `[${formatTime(t.timestamp)}] ${t.participantName || 'Unknown'}: ${t.text}`)
      .join('\n');
    
    try {
      await navigator.clipboard.writeText(content);
      // Could show a toast notification here
    } catch (err) {
      console.error('Failed to copy transcriptions:', err);
    }
  };

  const clearTranscriptions = () => {
    // This would need to be connected to the parent component's state management
    console.log('Clear transcriptions requested');
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gray-400" />
            <h3 className="text-white font-medium">Live Transcription</h3>
            {isLiveTranscriptionEnabled && (
              <Badge variant="secondary" className="bg-green-600 text-white">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                Live
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Live transcription toggle */}
            {onToggleLiveTranscription && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleLiveTranscription}
                className="text-gray-400 hover:text-white"
                title={isLiveTranscriptionEnabled ? 'Disable live transcription' : 'Enable live transcription'}
              >
                {isLiveTranscriptionEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transcriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="space-y-4">
            {/* Language Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Recognition Language</span>
                <Languages className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={transcriptionLanguage}
                onChange={(e) => setTranscriptionLanguage(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                disabled={isTranscribing}
              >
                {SpeechRecognitionService.getSupportedLanguages().map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              {isTranscribing && (
                <p className="text-xs text-yellow-400 mt-1">
                  Stop transcription to change language
                </p>
              )}
            </div>

            {/* Export Options */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Export Options</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyAllTranscriptions}
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportTranscriptions}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                {transcriptions.length} transcriptions
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearTranscriptions}
                className="text-xs text-red-400 border-red-400 hover:bg-red-900"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Transcriptions List */}
      <div className="flex-1 overflow-y-auto p-4" ref={containerRef}>
        {filteredTranscriptions.length > 0 ? (
          <div className="space-y-3">
            {filteredTranscriptions.map((transcription) => (
              <TranscriptionItem
                key={transcription.id}
                transcription={transcription}
              />
            ))}
            <div ref={transcriptionEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            {searchTerm ? (
              <>
                <Search className="h-8 w-8 mb-2" />
                <p className="text-sm">No transcriptions found for "{searchTerm}"</p>
              </>
            ) : (
              <>
                <MessageSquare className="h-8 w-8 mb-2" />
                <p className="text-sm">
                  {isLiveTranscriptionEnabled 
                    ? 'Transcriptions will appear here as people speak...'
                    : 'Enable live transcription to see speech-to-text'
                  }
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Live Transcription Status */}
      {isLiveTranscriptionEnabled && (
        <div className="p-3 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center justify-center space-x-2">
            {isTranscribing ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400">Listening for speech...</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-sm text-yellow-400">Ready to transcribe</span>
              </>
            )}
          </div>
          <div className="text-center mt-1">
            <span className="text-xs text-gray-400">
              Language: {SpeechRecognitionService.getSupportedLanguages().find(l => l.code === transcriptionLanguage)?.name || transcriptionLanguage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Individual Transcription Item Component
interface TranscriptionItemProps {
  transcription: Transcription;
}

const TranscriptionItem: React.FC<TranscriptionItemProps> = ({
  transcription
}) => {
  const [showFullText, setShowFullText] = useState(false);
  
  const formatTime = (timestamp: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp);
  };

  const copyTranscription = async () => {
    try {
      await navigator.clipboard.writeText(transcription.text);
      // Could show a toast notification here
    } catch (err) {
      console.error('Failed to copy transcription:', err);
    }
  };

  const isLongText = transcription.text.length > 150;
  const displayText = showFullText || !isLongText 
    ? transcription.text 
    : transcription.text.substring(0, 150) + '...';

  return (
    <Card className="bg-gray-800 border-gray-700 p-3">
      <div className="flex items-start space-x-3">
        {/* Speaker Avatar/Icon */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Speaker and Time */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-blue-400">
              {transcription.participantName || 'Unknown Speaker'}
            </span>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              {transcription.confidence && (
                <span>
                  {Math.round(transcription.confidence * 100)}% confidence
                </span>
              )}
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(transcription.timestamp)}</span>
              </div>
            </div>
          </div>

          {/* Transcription Text */}
          <p className="text-white text-sm leading-relaxed mb-2">
            {displayText}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            {isLongText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullText(!showFullText)}
                className="text-xs text-gray-400 hover:text-white p-0 h-auto"
              >
                {showFullText ? 'Show less' : 'Show more'}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={copyTranscription}
              className="text-gray-400 hover:text-white p-1 h-auto"
              title="Copy transcription"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Transcription Summary Component
interface TranscriptionSummaryProps {
  transcriptions: Transcription[];
}

export const TranscriptionSummary: React.FC<TranscriptionSummaryProps> = ({
  transcriptions
}) => {
  const stats = React.useMemo(() => {
    const totalWords = transcriptions.reduce((acc, t) => acc + t.text.split(' ').length, 0);
    const speakers = new Set(transcriptions.map(t => t.participantName).filter(Boolean));
    const avgConfidence = transcriptions
      .filter(t => t.confidence)
      .reduce((acc, t) => acc + (t.confidence || 0), 0) / transcriptions.length;

    return {
      totalTranscriptions: transcriptions.length,
      totalWords,
      uniqueSpeakers: speakers.size,
      avgConfidence: Math.round(avgConfidence * 100)
    };
  }, [transcriptions]);

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      <h4 className="text-white font-medium mb-3">Session Summary</h4>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Transcriptions:</span>
          <span className="text-white ml-2">{stats.totalTranscriptions}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Words:</span>
          <span className="text-white ml-2">{stats.totalWords}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Speakers:</span>
          <span className="text-white ml-2">{stats.uniqueSpeakers}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Avg. Confidence:</span>
          <span className="text-white ml-2">{stats.avgConfidence}%</span>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
