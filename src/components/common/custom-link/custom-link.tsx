import React, { FC } from 'react';
import { default as NextLink } from 'next/link'; // Alias next/link's Link as NextLink
import { CustomLinkProps, CustomLinkTypes } from './custom-link.types';
import { customLinkStyles } from './custom-link.styles';

const Link: FC<CustomLinkProps> = ({
  styleType = CustomLinkTypes.SECONDARY,
  href,
  children,
  className,
}) => {
  return (
    <NextLink
      className={`${customLinkStyles[styleType]} ${className}`}
      href={href}
    >
      {children}
    </NextLink>
  );
};

export default Link;
