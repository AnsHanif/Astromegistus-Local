import { JSX } from 'react';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import Link from '@/components/common/custom-link/custom-link';

interface CoachingCardProps {
  image: string;
  title: string;
  description?: string;
  duration: string;
  buttonText: string;
  href: string;
  classNames?: string;
}

export default function CoachingCard({
  image,
  title,
  description,
  duration,
  buttonText,
  href,
  classNames,
}: CoachingCardProps): JSX.Element {
  return (
    <div
      className={`w-full h-full max-w-[500px] bg-grey-light-50 p-2 pb-6 overflow-hidden flex flex-col ${classNames}`}
    >
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="p-2 flex flex-col flex-grow">
        {/* Title & Tag */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-size-large font-semibold text-gray-800">
            {title}
          </h2>
        </div>

        {/* Description */}
        {description && (
          <p className="text-justify text-sm mb-4 flex-grow">{description}</p>
        )}

        {/* Duration */}
        <div className="flex items-start text-sm mb-4">
          <span className="mr-2">
            <Clock className="w-4 h-4" />
          </span>
          {duration}
        </div>

        {/* Button */}
        <Link
          href={href}
          className="bg-emerald-green text-center content-center mt-24 md:mt-44 max-w-[320px] w-full mx-auto text-white p-1 font-medium h-12 md:h-15 rounded-none hover:bg-green-800 transition"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
