// components/ProductCard.tsx
import { JSX } from 'react';
import Image from 'next/image';
import { Clock, ShoppingCart, Trash2 } from 'lucide-react';
import Link from '@/components/common/custom-link/custom-link';

interface ProductCardProps {
  image: string;
  title: string;
  tag?: string;
  description?: string;
  duration: string;
  automatedPrice?: number;
  livePrice?: number;
  buttonText: string;
  href: string;
  classNames?: string;
  isInCart?: boolean;
  onCartToggle?: (productId: string) => void;
  productId?: string;
  categories?: string[];
}

export default function ProductCard({
  image = '/images/no-image.png',
  title,
  tag,
  description,
  duration,
  buttonText,
  href,
  classNames,
  isInCart = false,
  automatedPrice,
  livePrice,
  categories,
  onCartToggle,
  productId,
}: ProductCardProps): JSX.Element {
  console.log('image url are : ', image);
  return (
    <div
      className={`w-full h-full max-w-[500px] bg-grey-light-50 p-2 pb-6 overflow-hidden flex flex-col ${classNames}`}
    >
      {/* Image */}
      <div className="relative h-48 w-full">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover shadow-sm"
            priority
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}

        {/* Cart Toggle Icon */}
        {onCartToggle && productId && (
          <button
            onClick={() => onCartToggle(productId)}
            className="absolute top-2 right-2 w-8 h-8 bg-grey-light-50 cursor-pointer hover:bg-black rounded-full flex items-center justify-center transition-all duration-200 z-10 group"
            aria-label={isInCart ? 'Remove from cart' : 'Add to cart'}
          >
            {isInCart ? (
              <Trash2 className="w-4 h-4 text-red-500 group-hover:text-white transition-colors duration-200" />
            ) : (
              <ShoppingCart className="w-4 h-4 text-black group-hover:text-white transition-colors duration-200" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-2 flex flex-col flex-grow">
        {/* Title & Tag */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            {title}
          </h2>
          {tag && (
            <span
              className={`text-xs px-3 py-1.5 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark`}
            >
              {tag}
            </span>
          )}
          {categories && categories.length > 0 && (
            <span
              className={`text-xs px-3 py-1.5 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark`}
            >
              {categories
                .map((category) => category.replace('_', ' '))
                .join(' / ')}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-justify text-base mb-4 flex-grow">{description}</p>
        )}

        {/* Duration */}
        <div className="flex items-start text-sm mb-4">
          <span className="mr-2">
            <Clock className="w-4 h-4" />
          </span>
          {duration}
        </div>

        {/* Pricing Section - Only render if there are prices */}
        {(Number(automatedPrice) > 0 || Number(livePrice) > 0) && (
          <div className="text-semibold">
            {Number(automatedPrice) > 0 && (
              <div className="flex mb-4 items-center justify-between">
                Automated Price: ${automatedPrice}
              </div>
            )}
            {Number(livePrice) > 0 && (
              <div className="flex items-center justify-between">
                Live Price: ${livePrice}
              </div>
            )}
          </div>
        )}

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
