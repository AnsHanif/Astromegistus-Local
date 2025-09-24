export type ManualReadingForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  day?: string;
  month?: string;
  year?: string;
  hour?: string;
  minute?: string;
  timePeriod?: string;
  gender?: string;
  birthCountry?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  question1?: string;
  question2?: string;
};

export interface ManualReading {
  onNext?: () => void;
  onPrev?: () => void;
}
