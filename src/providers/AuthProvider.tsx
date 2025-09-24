'use client';

import { useAuth } from '@/hooks/user-auth';
import { ReactNode } from 'react';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();
  return <>{children}</>;
}
