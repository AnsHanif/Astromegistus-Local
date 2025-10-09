import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { timeSlotAPI } from '@/services/api/timeslot-api';
import { RootState } from '@/store/store';

export const useGetUserMonthSlots = (year: number, month: number) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userId = currentUser?.id;

  return useQuery({
    queryKey: ['timeslots', 'month', userId, year, month],
    queryFn: () => timeSlotAPI.getUserMonthSlots(year, month),
    enabled: !!(year && month && userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};