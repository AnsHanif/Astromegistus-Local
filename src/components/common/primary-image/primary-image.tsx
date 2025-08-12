import { useState } from 'react';
import Image from 'next/image';
import { PrimaryImageProps } from './primary-image.types';

const PrimaryImage: React.FC<PrimaryImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  quality = 100,
  // loading = "lazy",
  style = {},
  blur = 'empty',
  blurDataURL = '',
  priority = false,
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const DEFAULT_URL = '/avatar.jpeg';

  return (
    <Image
      src={imgSrc || DEFAULT_URL}
      alt={alt}
      width={width}
      height={height}
      onClick={onClick}
      // loading={loading}

      fill={fill}
      priority={priority}
      quality={quality}
      style={{ ...style }}
      placeholder={blur === 'blur' ? 'blur' : 'empty'}
      className={`h-[${height}px] w-[${width}px] object-cover ${className}`}
      blurDataURL={blur === 'blur' ? blurDataURL || DEFAULT_URL : undefined}
      onError={() => setImgSrc(DEFAULT_URL)}
    />
  );
};

export default PrimaryImage;
