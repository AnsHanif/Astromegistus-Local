import { ReactNode } from 'react';

export enum CustomLinkTypes {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export interface CustomLinkProps {
  href: string;
  styleType?: CustomLinkTypes;
  children: ReactNode;
  className?: string;
}
