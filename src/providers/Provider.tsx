'use client';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import ToastCloseButton from '@/components/common/toast-close-button';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 180000, // Data remains fresh for 3 minutes

      refetchOnWindowFocus: false, // Prevent refetch when tab is focused
    },
  },
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      action={(key) => <ToastCloseButton snackbarKey={key} />}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </SnackbarProvider>
  );
};

export default Provider;
