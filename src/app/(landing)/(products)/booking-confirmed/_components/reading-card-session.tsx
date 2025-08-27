// components/ReadingSessionCard.tsx
import { Button } from '@/components/ui/button';
import { Clock, Eye } from 'lucide-react';

interface CardProps {
  title: string;
  type: 'reading' | 'session';
  label: string;
  duration: string;
  actionText: string;
  onAction?: () => void;
}

export default function ReadingSessionCard({
  title,
  type,
  label,
  duration,
  actionText,
  onAction,
}: CardProps) {
  return (
    <div className="flex justify-between items-center border border-[#D9D9D9] p-6 bg-grey-light-50 mb-4">
      {/* Left Content */}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <span
          className={`inline-block bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-xs font-medium px-2 py-1 rounded mt-1 text-black`}
        >
          {label}
        </span>
        <div className="flex items-center text-gray-500 text-sm mt-2">
          <Clock className="w-4 h-4 mr-1" />
          {duration}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onAction}
        className={`flex items-center gap-2 px-5 py-2 font-medium transition
          ${
            type === 'reading'
              ? 'bg-emerald-green text-white hover:bg-green-800'
              : 'border border-green-900 text-green-900 hover:bg-green-50'
          }`}
      >
        {type === 'session' && <Eye className="w-4 h-4" />}
        {actionText}
      </button>
    </div>
  );
}
