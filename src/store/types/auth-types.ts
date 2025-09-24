// features/auth/authTypes.ts

// Match your API response
export interface User {
  name: string;
  email: string;
  dateOfBirth: string;
  timeOfBirth: string;
  verificationCode: string;
  verificationCodeExpires: string;
  gender: string;
  placeOfBirth: string;
  role: string;
  timeZone: string;
  isUserVerified: boolean;
  subscriptions?: {
    id: string;
    status: boolean;
    startedAt: string;
    endedAt: string;
    plan: {
      id: string;
      name: string;
      type: string;
    };
  }[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
