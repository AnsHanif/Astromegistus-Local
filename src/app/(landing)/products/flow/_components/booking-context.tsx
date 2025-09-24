'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from 'react';

export type BookingType =
  | 'automated-reading'
  | 'manual-reading'
  | 'coaching-session';

export interface BookingData {
  // Common fields
  productId: string;
  bookingType: BookingType;

  // Personal Information
  fullName: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  timePeriod: string;
  gender: string;
  birthCountry: string;

  // Questions (for manual reading)
  question1: string;
  question2: string;
  question3: string;

  // Step 2 - Preparation Time Agreement
  preparationTimeAgreed: boolean;

  // Selection
  selectedProvider: string | null; // astrologer or coach
  selectedProviderName: string | null; // coach/astrologer name for display
  selectionType: 'auto' | 'manual' | null;

  // Scheduling
  selectedDate: string;
  selectedTime: string;
  timezone: string;

  // Optional contact information
  email?: string;
  phone?: string;

  // Booking Details
  bookingId: string | null;
  status: 'pending' | 'confirmed' | 'completed';
  
  // Session Details (for display)
  sessionTitle: string | null;
  sessionDescription: string | null;
}

interface BookingContextType {
  data: BookingData;
  updateData: (updates: Partial<BookingData>) => void;
  resetData: () => void;
  setBookingType: (type: BookingType) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialData: BookingData = {
  productId: '',
  bookingType: 'manual-reading',
  fullName: '',
  day: '',
  month: '',
  year: '',
  hour: '',
  minute: '',
  timePeriod: '',
  gender: '',
  birthCountry: '',
  question1: '',
  question2: '',
  question3: '',
  preparationTimeAgreed: false,
  selectedProvider: null,
  selectedProviderName: null,
  selectionType: null,
  selectedDate: '',
  selectedTime: '',
  timezone: '',
  email: '',
  phone: '',
  bookingId: null,
  status: 'pending',
  sessionTitle: null,
  sessionDescription: null,
};

export const BookingProvider: FC<{
  children: ReactNode;
  initialProductId?: string;
  bookingType?: BookingType;
}> = ({ children, initialProductId = '', bookingType = 'manual-reading' }) => {
  const [data, setData] = useState<BookingData>({
    ...initialData,
    productId: initialProductId,
    bookingType,
  });

  const updateData = (updates: Partial<BookingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(initialData);
  };

  const setBookingType = (type: BookingType) => {
    setData((prev) => ({ ...prev, bookingType: type }));
  };

  return (
    <BookingContext.Provider
      value={{ data, updateData, resetData, setBookingType }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
