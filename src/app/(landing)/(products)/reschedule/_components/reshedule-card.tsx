'use client';

import PrimaryImage from '@/components/common/primary-image/primary-image';
import { FC } from 'react';

interface RescheduleCardProps {
  name: string;
  avatar: string;
  sessionType?: string;
  date?: string;
  time?: string;
  fee?: string;
  title: string;
  classNames?: string;
}

const RescheduleCard: FC<RescheduleCardProps> = ({
  name,
  avatar,
  sessionType,
  date,
  time,
  title,
  fee,
  classNames,
}) => {
  return (
    <div className={`w-full ${classNames}`}>
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      {/* Card Content */}
      <div className="p-4 md:p-8 md:pt-6 bg-grey-light-50 flex flex-col gap-4 md:gap-0">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <PrimaryImage
            src={avatar}
            alt={name}
            width={60}
            height={60}
            className="rounded-full h-[50px] md:h-[70px] max-w-[50px] md:max-w-[70px] w-full"
          />
          <h3 className="text-size-large md:text-size-heading md:font-semibold">
            {name}
          </h3>
        </div>

        {/* Info */}
        <div className="md:ml-22 max-w-[25rem] w-full">
          <div className="mt-2 text-sm space-y-2">
            <div className="grid grid-cols-2 gap-4">
              {sessionType && (
                <>
                  <p className="font-medium">Session Type</p>
                  <p>{sessionType}</p>
                </>
              )}

              {date && (
                <>
                  <p className="font-medium">Current Date</p>
                  <p>{date}</p>
                </>
              )}

              {time && (
                <>
                  <p className="font-medium">Current Time</p>
                  <p>{time}</p>
                </>
              )}

              {fee && (
                <>
                  <p className="font-medium">Session Fee</p>
                  <p className="font-semibold text-black">{fee}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleCard;
