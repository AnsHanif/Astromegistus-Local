import { JSX } from 'react';
import Image from 'next/image';
import { Clock, Download, Eye, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookedProductsProps {
  image: string;
  title: string;
  tag: string;
  description: string;
  duration: string;
  classNames?: string;
  type: string;
}

export default function BookedProducts({
  image,
  title,
  tag,
  description,
  duration,
  classNames,
  type,
}: BookedProductsProps): JSX.Element {
  return (
    <div
      className={`w-full h-full max-w-[500px] bg-[#3F3F3F] p-3 pb-4 overflow-hidden flex flex-col ${classNames}`}
    >
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="p-2 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-size-large font-semibold">{title}</h2>
          <span
            className={`text-sm font-normal px-4 py-1.5 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black`}
          >
            {tag}
          </span>
        </div>

        <p className="text-justify text-sm mb-4 flex-grow">{description}</p>

        <div className="flex items-start text-sm mb-4">
          <span className="mr-2 mt-0.5">
            <Clock className="w-4 h-4" />
          </span>
          {duration}
        </div>

        {type === 'live' && (
          <div className="flex items-start text-sm mb-4">
            <span className="mr-2 mt-0.5">
              <Radio className="w-4 h-4" />
            </span>
            <div className="flex justify-between w-full">
              <span>Joined On</span>
              <span> Aug 15, 2025, 2:00 PM (EST)</span>
            </div>
          </div>
        )}

        {type === 'reading' && (
          <div className="mt-24 md:mt-40 flex flex-col sm:flex-row gap-5">
            <Button className="flex items-center gap-2 flex-1 bg-transparent text-golden-glow  border border-golden-glow">
              <Eye className="mb-0.5" /> View Reading
            </Button>

            <Button className="flex items-center gap-2 flex-1 text-black">
              <Download /> Download PDF
            </Button>
          </div>
        )}

        {type === 'live' && (
          <div className="mt-24 md:mt-40 flex flex-col sm:flex-row gap-5">
            <Button
              className="flex items-center gap-2 flex-1 text-black"
              disabled
            >
              <Radio /> Join Session
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
