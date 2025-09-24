'use client';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';
import { SnackbarProvider } from 'notistack';
import ToastCloseButton from '@/components/common/toast-close-button';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import AuthProvider from './AuthProvider';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 180000, // Data remains fresh for 3 minutes

      refetchOnWindowFocus: false, // Prevent refetch when tab is focused
    },
  },
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || '');
  return (
    <Elements stripe={stripePromise}>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
          vault: true,
          intent: 'subscription',
        }}
      >
        <ReduxProvider store={store}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            action={(key) => <ToastCloseButton snackbarKey={key} />}
            dense={false}
            hideIconVariant={false}
            preventDuplicate={true}
            autoHideDuration={4000}
            classes={{
              containerRoot: 'z-[10000]',
            }}
          >
            <QueryClientProvider client={queryClient}>
              <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
          </SnackbarProvider>
        </ReduxProvider>
      </PayPalScriptProvider>
    </Elements>
  );
};

export default Provider;
