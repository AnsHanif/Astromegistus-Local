'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface Coach {
  id: string;
  name: string;
  expertise: string;
  image: string;
  rating: number;
  sessions: number;
}

interface CoachProfileCardProps {
  coach: Coach;
  isSelected: boolean;
  onSelect: () => void;
}

const CoachProfileCard: React.FC<CoachProfileCardProps> = ({
  coach,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-emerald-green bg-emerald-green/10'
          : 'border-gray-300 hover:border-emerald-green hover:bg-emerald-green/5'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-semibold">
            {coach.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{coach.name}</h3>
          <p className="text-xs text-gray-600">{coach.expertise}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600">{coach.rating}</span>
            <span className="text-xs text-gray-500">
              ({coach.sessions} sessions)
            </span>
          </div>
        </div>
        <div
          className={`w-4 h-4 rounded-full border-2 ${
            isSelected
              ? 'bg-emerald-green border-emerald-green'
              : 'border-gray-300'
          }`}
        >
          {isSelected && (
            <div className="w-full h-full rounded-full bg-white scale-50"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachProfileCard;
