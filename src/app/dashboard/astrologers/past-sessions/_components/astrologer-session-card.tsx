import { FC } from 'react';
import { Clock, Radio, Download, Check } from 'lucide-react';

interface SessionData {
  id: string;
  clientName: string;
  duration: string;
  price?: number;
  completedAt?: string;
  updatedAt: string;
  createdAt?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  providerTimezone?: string;
}

interface AstrologersSessionCardProps {
  session: SessionData;
  tag: string; // e.g. "Predictive"
  statusLabel: string; // e.g. "Joined On" or "Completed"
  type?: string; // if you still want this to control "preparing" logic
  classNames?: string;
}

const AstrologersSessionCard: FC<AstrologersSessionCardProps> = ({
  session,
  tag,
  statusLabel,
  type,
  classNames = '',
}) => {
  // Format the completion date with proper validation
  const getValidDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Use scheduledEndTime as the completion date, with fallbacks
  const completionDate =
    getValidDate(session.scheduledEndTime) ||
    getValidDate(session.completedAt) ||
    getValidDate(session.updatedAt) ||
    new Date();

  const statusDate = completionDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: session.providerTimezone || 'UTC',
  });

  // Format the session time with proper validation
  const getValidSessionTime = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return null;
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

    return {
      startDate,
      endDate,
    };
  };

  const sessionTimeData = getValidSessionTime(
    session.scheduledStartTime,
    session.scheduledEndTime
  );

  const sessionTime = sessionTimeData
    ? `${new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: session.providerTimezone || 'UTC',
      }).format(sessionTimeData.startDate)}
at ${new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: session.providerTimezone || 'UTC',
      }).format(sessionTimeData.startDate)}
- ${new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: session.providerTimezone || 'UTC',
      }).format(sessionTimeData.endDate)}
${session.providerTimezone ? ` (${session.providerTimezone})` : ''}`
    : (() => {
        const fallbackDate =
          getValidDate(session.createdAt) ||
          getValidDate(session.updatedAt) ||
          new Date();
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: session.providerTimezone || 'UTC',
        }).format(fallbackDate);
      })();

  const earned = session.price ? session.price.toString() : '0';
  return (
    <div
      className={`flex items-center justify-between bg-graphite py-6 px-4 sm:px-8 text-white shadow-lg gap-4 ${classNames}`}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="md:text-size-large font-semibold">
              {session.clientName}
            </h2>
            <span className="text-sm font-normal flex gap-1 px-4 pt-1.5 pb-0.5 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black w-fit">
              <Check className="w-4 h-4" /> {tag}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" /> {session.duration}
        </div>

        {sessionTime && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" /> {sessionTime}
          </div>
        )}

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
