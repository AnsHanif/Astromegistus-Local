'use client';

import React from 'react';
import { VideoCallParticipant } from './VideoCallInterface';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Mic, MicOff, Video, VideoOff, Crown, Users } from 'lucide-react';

interface ParticipantListProps {
  participants: VideoCallParticipant[];
  hostUid?: string | number;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  hostUid
}) => {
  const sortedParticipants = React.useMemo(() => {
    return [...participants].sort((a, b) => {
      // Host first
      if (a.uid === hostUid) return -1;
      if (b.uid === hostUid) return 1;
      
      // Then by name
      return a.name.localeCompare(b.name);
    });
  }, [participants, hostUid]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-400" />
          <h3 className="text-white font-medium">
            Participants ({participants.length})
          </h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sortedParticipants.length > 0 ? (
          <div className="space-y-3">
            {sortedParticipants.map((participant) => (
              <ParticipantItem
                key={participant.uid}
                participant={participant}
                isHost={participant.uid === hostUid}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <Users className="h-8 w-8 mb-2" />
            <p className="text-sm">No participants yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ParticipantItemProps {
  participant: VideoCallParticipant;
  isHost?: boolean;
}

const ParticipantItem: React.FC<ParticipantItemProps> = ({
  participant,
  isHost = false
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = () => {
    if (participant.hasVideo && participant.hasAudio) return 'bg-green-500';
    if (participant.hasVideo || participant.hasAudio) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-10 w-10">
          {participant.profilePic ? (
            <img 
              src={participant.profilePic} 
              alt={participant.name}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="bg-blue-600 text-white font-semibold text-sm flex items-center justify-center rounded-full w-full h-full">
              {getInitials(participant.name)}
            </div>
          )}
        </Avatar>
        
        {/* Status indicator */}
        <div 
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor()}`}
        />
      </div>

      {/* Participant Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-white text-sm font-medium truncate">
            {participant.name}
          </p>
          {isHost && (
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
        </div>
        
        <div className="flex items-center space-x-1 mt-1">
          <span className="text-xs text-gray-400">
            UID: {participant.uid}
          </span>
        </div>
      </div>

      {/* Media Status */}
      <div className="flex items-center space-x-1">
        <div
          className={`p-1.5 rounded ${
            participant.hasAudio 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}
          title={participant.hasAudio ? 'Audio on' : 'Audio off'}
        >
          {participant.hasAudio ? (
            <Mic className="h-3 w-3" />
          ) : (
            <MicOff className="h-3 w-3" />
          )}
        </div>
        
        <div
          className={`p-1.5 rounded ${
            participant.hasVideo 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}
          title={participant.hasVideo ? 'Video on' : 'Video off'}
        >
          {participant.hasVideo ? (
            <Video className="h-3 w-3" />
          ) : (
            <VideoOff className="h-3 w-3" />
          )}
        </div>
      </div>
    </div>
  );
};

// Participant Statistics Component
interface ParticipantStatsProps {
  participants: VideoCallParticipant[];
}

export const ParticipantStats: React.FC<ParticipantStatsProps> = ({
  participants
}) => {
  const stats = React.useMemo(() => {
    const total = participants.length;
    const withVideo = participants.filter(p => p.hasVideo).length;
    const withAudio = participants.filter(p => p.hasAudio).length;
    const active = participants.filter(p => p.hasVideo || p.hasAudio).length;
    
    return { total, withVideo, withAudio, active };
  }, [participants]);

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{stats.active}</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-400">{stats.withVideo}</div>
          <div className="text-xs text-gray-400">Video On</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-400">{stats.withAudio}</div>
          <div className="text-xs text-gray-400">Audio On</div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantList;
