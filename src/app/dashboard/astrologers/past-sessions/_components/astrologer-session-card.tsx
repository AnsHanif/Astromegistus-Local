import { FC } from 'react';
import { Clock, Radio, Download, Check } from 'lucide-react';

interface AstrologersSessionCardProps {
  name: string; // e.g. "Your Next 12 Months"
  tag: string; // e.g. "Predictive"
  duration: string; // e.g. "11:00 (60 mins)"
  statusLabel: string; // e.g. "Joined On" or "Completed"
  statusDate: string; // e.g. "Aug 15, 2025, 2:00 PM (EST)"
  earned: string; // e.g. "$12"
  type?: string; // if you still want this to control "preparing" logic
  classNames?: string;
}

const AstrologersSessionCard: FC<AstrologersSessionCardProps> = ({
  name,
  tag,
  duration,
  statusLabel,
  statusDate,
  earned,
  type,
  classNames = '',
}) => {
  return (
    <div
      className={`flex items-center justify-between bg-graphite py-6 px-4 sm:px-8 text-white shadow-lg gap-4 ${classNames}`}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="md:text-size-large font-semibold">{name}</h2>
            <span className="text-sm font-normal flex gap-1 px-4 pt-1.5 pb-0.5 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black w-fit">
              <Check className="w-4 h-4" /> {tag}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" /> {duration}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between text-sm max-w-lg">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4" /> {statusLabel}
          </div>
          <span>{statusDate}</span>
        </div>
      </div>

      {/* Earnings + Download */}
      <div className="max-w-[10rem] w-full flex items-center gap-2 justify-between">
        <div className="text-size-heading md:text-size-primary bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] bg-clip-text text-transparent">
          <span className="block">${earned}</span>
          {/* <span className="block text-xs text-center">${earned}</span> */}
        </div>
        <Download />
      </div>
    </div>
  );
};

export default AstrologersSessionCard;
