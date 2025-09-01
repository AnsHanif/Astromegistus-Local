// components/ReadingSessionCard.tsx
import { Clock, Eye } from 'lucide-react';

interface CardProps {
  title: string;
  type: 'reading' | 'session';
  label: string;
  duration: string;
  actionText: string;
  onAction?: () => void;
  classNames?: string;
}

export default function ReadingSessionCard({
  title,
  type,
  label,
  duration,
  actionText,
  classNames,
  onAction,
}: CardProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center gap-4 border border-[#D9D9D9] p-3 md:p-6 bg-grey-light-50 ${classNames}`}
    >
      {/* Left Content */}
      <div className='text-center sm:text-left'>
        <h3 className="text-size-large md:text-size-heading font-semibold">
          {title}
        </h3>
        <span
          className={`inline-block bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-xs px-2 py-1 mt-2 text-black`}
        >
          {label}
        </span>
        <div className="flex justify-center sm:justify-start items-center text-sm mt-3">
          <Clock className="w-4 h-4 mr-2" />
          {duration}
        </div>
      </div>

      {/* Action Button */}
      <button
        // variant={'outline'}
        onClick={onAction}
        className={`flex items-center gap-2 h-12 md:h-15 max-w-[15rem] w-full justify-center cursor-pointer px-5 py-2 font-medium transition
          ${
            type === 'reading'
              ? 'bg-emerald-green text-white hover:bg-green-800'
              : 'border border-emerald-green text-emerald-green hover:bg-green-50'
          }`}
      >
        {type === 'session' && <Eye className="w-5 h-5" />}
        {actionText}
      </button>
    </div>
  );
}
