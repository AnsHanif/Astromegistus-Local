// src/hooks/mutation/booking-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import {
  bookingAPI,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  RescheduleBookingRequest,
  SavePreparationNotesRequest,
  CreateCoachingSessionBookingRequest,
  CreateRandomBookingRequest,
  CreateRandomCoachingBookingRequest,
} from '@/services/api/booking-api';
import { externalLocationAPI } from '@/services/api/location-api';
import { CheckLocationRequest, CheckLocationResponse } from '@/types/location';
import axiosInstance from '@/services/axios';
import { getErrorMessage } from '@/utils/error-handler';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingAPI.createBooking(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['purchased-products'] });
      enqueueSnackbar('Booking created successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    },
  });
};

export const useCreateCoachingSessionBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCoachingSessionBookingRequest) =>
      bookingAPI.createCoachingSessionBooking(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['coaching-sessions'] });
      enqueueSnackbar('Coaching session booked successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to book coaching session.',
        { variant: 'error' }
      );
    },
  });
};

export const useCreateRandomBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRandomBookingRequest) =>
      bookingAPI.createRandomBooking(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      enqueueSnackbar(
        'Booking created successfully with auto-assigned astrologer!',
        {
          variant: 'success',
        }
      );
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to create booking.',
        { variant: 'error' }
      );
    },
  });
};

export const useCreateRandomCoachingBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRandomCoachingBookingRequest) =>
      bookingAPI.createRandomCoachingBooking(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['coaching-sessions'] });
      enqueueSnackbar(
        'Coaching session booked successfully with auto-assigned coach!',
        {
          variant: 'success',
        }
      );
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to book coaching session.',
        { variant: 'error' }
      );
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: UpdateBookingStatusRequest;
    }) => bookingAPI.updateBookingStatus(bookingId, data),
    onSuccess: (response, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['booking-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['past-sessions'] });
      queryClient.invalidateQueries({
        queryKey: ['session-preparation', variables.bookingId],
      });

      enqueueSnackbar(
        `Booking status updated to ${variables.data.status.toLowerCase()}!`,
        {
          variant: 'success',
        }
      );
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update booking status.',
        { variant: 'error' }
      );
    },
  });
};

export const useRescheduleBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      type?: string;
      data: RescheduleBookingRequest;
    }) => bookingAPI.rescheduleBooking(bookingId, data),
    onSuccess: (response, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['booking-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-sessions'] });
      queryClient.invalidateQueries({
        queryKey: ['session-preparation', variables.bookingId],
      });
      queryClient.invalidateQueries({
        queryKey: ['readings', 'recent'],
      });

      enqueueSnackbar('Booking rescheduled successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to reschedule booking.',
        { variant: 'error' }
      );
    },
  });
};

export const useSavePreparationNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: SavePreparationNotesRequest;
    }) => bookingAPI.savePreparationNotes(bookingId, data),
    onSuccess: (response, variables) => {
      // Invalidate session preparation query to reflect updated notes
      queryClient.invalidateQueries({
        queryKey: ['session-preparation', variables.bookingId],
      });

      enqueueSnackbar('Preparation notes saved successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to save preparation notes.',
        { variant: 'error' }
      );
    },
  });
};

export const useCheckLocation = () => {
  return useMutation({
    mutationFn: async (
      data: CheckLocationRequest
    ): Promise<CheckLocationResponse> => {
      const { cityName, countryID } = data;

      // Check external API
      const externalData = await externalLocationAPI.checkLocation(
        cityName,
        countryID
      );

      if (!externalData) {
        return {
          exists: false,
          message: 'Location not found in external API',
        };
      }

      return {
        exists: true,
        location: externalData,
        message: 'Location found in external API',
      };
    },

    onError: (error: any) => {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    },
  });
};

// ============================================
// V2 Booking Mutations
// ============================================

export const useCreateBookingV2 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      providerId: string;
      productId: string;
      startDateTimeUTC: string;
      endDateTimeUTC: string;
    }) => bookingAPI.createBookingV2(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots-v2'] });
      enqueueSnackbar('Booking created successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to create booking.';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};

export const useCreateCoachingBookingV2 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      providerId: string;
      sessionId: string;
      // startDateTimeUTC: string;
      // endDateTimeUTC: string;
      selectedDate: string;
      selectedTime: string;
      timezone: string;
    }) => bookingAPI.createCoachingSessionBooking(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['coaching-sessions'] });
      queryClient.invalidateQueries({
        queryKey: ['purchased-products'],
      });
      enqueueSnackbar('Coaching session booked successfully!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to book coaching session.';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};
