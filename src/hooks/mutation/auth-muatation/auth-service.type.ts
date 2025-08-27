export type SignUpUser = {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  birthCountry: string;
  dateOfBirth: { day: string; month: string; year: string };
  timeOfBirth: { hour: string; minute: string; timePeriod: string };
  timezone: string;
};

export type LoginUser = {
  email: string;
  password: string;
};

export type ForgotPassword = {
  email: string;
};

export type VerifyEmail = {
  code: number;
  token: string;
};

export type ResendCode = {
  token: string;
};

export type ResetPassword = {
  password: string;
  token: string;
};
