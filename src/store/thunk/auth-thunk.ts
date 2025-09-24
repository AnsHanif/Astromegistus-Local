// features/auth/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axios';
import { User } from '../types/auth-types';

// 👇 async thunk to fetch user from API
export const fetchUser = createAsyncThunk<User>(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/verify-token'); // replace with your endpoint
      return response.data.data as User;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user'
      );
    }
  }
);
