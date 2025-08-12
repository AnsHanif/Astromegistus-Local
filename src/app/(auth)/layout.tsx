import React, { FC, ReactNode } from 'react';
import AuthModeLayout from './_components/auth-mode-layout';
import Footer from '@/components/common/footer';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="">
      <main>
        <AuthModeLayout>{children}</AuthModeLayout>
        <Footer />
      </main>
    </div>
  );
};

export default AuthLayout;
