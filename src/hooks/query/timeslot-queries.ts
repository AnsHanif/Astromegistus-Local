import { useQuery } from '@tanstack/react-query';
import { timeSlotAPI } from '@/services/api/timeslot-api';

export const useGetUserMonthSlots = (year: number, month: number) => {
  return useQuery({
    queryKey: ['timeslots', 'month', year, month],
    queryFn: () => timeSlotAPI.getUserMonthSlots(year, month),
    enabled: !!(year && month),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};