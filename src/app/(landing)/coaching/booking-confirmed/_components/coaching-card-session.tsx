// components/ReadingSessionCard.tsx
import { Clock, Eye } from 'lucide-react';

interface CardProps {
  title: string;
  duration: string;
  actionText: string;
  onAction?: () => void;
  classNames?: string;
}

export default function CoachingSessionCard({
  title,
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
      <div className="text-center sm:text-left">
        <h3 className="text-size-large md:text-size-heading font-semibold">
          {title}
        </h3>

        <div className="flex justify-center sm:justify-start items-center text-sm mt-3">
          <Clock className="w-4 h-4 mr-2" />
          {duration}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onAction}
        className={`flex items-center gap-2 h-12 md:h-15 max-w-[15rem] w-full justify-center cursor-pointer px-5 py-2 font-medium transition
          border border-emerald-green text-emerald-green hover:bg-green-50`}
      >
        <Eye className="w-5 h-5" />
        {actionText}
      </button>
    </div>
  );
}
