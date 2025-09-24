import React, { FC, PropsWithChildren } from 'react';

interface AstrologersLayoutProps extends PropsWithChildren {}

const AstrologersLayout: FC<AstrologersLayoutProps> = ({ children }) => {
  return <div className="min-h-screen bg-black">{children}</div>;
};

export default AstrologersLayout;
