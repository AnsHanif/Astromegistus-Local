import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePic?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  gender?: string;
  placeOfBirth?: string;
  timeZone?: string;
  isUserVerified?: boolean;
  defaultPaymentMethod?: string | null;
  subscriptions?: Array<{
    id: string;
    status: boolean;
    startedAt: string;
    endedAt: string;
    plan: {
      id: string;
      name: string;
      type: string;
      price?: number;
    };
  }>;
}

interface UserState {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  token: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    updateUserSubscription: (
      state,
      action: PayloadAction<User['subscriptions']>
    ) => {
      if (state.currentUser) {
        state.currentUser.subscriptions = action.payload;
      }
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setCurrentUser,
  clearCurrentUser,
  setToken,
  updateUserSubscription,
  setUserLoading,
  setUserError,
} = userSlice.actions;

export default userSlice.reducer;
