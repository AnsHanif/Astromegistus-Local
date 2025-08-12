import { StaticImageData } from 'next/image';

export interface PrimaryImageProps {
  src: string | StaticImageData | undefined;
  alt: string;
  width?: number;
  fill?: boolean;
  height?: number;
  className?: string;
  quality?: number;
  // loading?: "lazy" | "eager";
  style?: React.CSSProperties;
  blur?: 'emtpy' | 'blur';
  blurDataURL?: string;
  priority?: boolean;
  onClick?: () => void;
}
