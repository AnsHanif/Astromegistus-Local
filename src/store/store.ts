// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import userReducer from './slices/user-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

// Types for TypeScript hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
