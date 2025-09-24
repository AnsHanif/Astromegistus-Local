'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setCurrentUser, clearCurrentUser } from '@/store/slices/user-slice';
import axiosInstance from '@/services/axios';
import Cookies from 'js-cookie';

const fetchUser = async () => {
  const token = Cookies.get('astro-tk');
  const res = await axiosInstance.get('/auth/verify-token', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: fetchUser,
    staleTime: Infinity,
    retry: false,
    enabled: !!Cookies.get('astro-tk'),
  });

  useEffect(() => {
    const token = Cookies.get('astro-tk');

    if (!token) return;

    if (error) {
      dispatch(clearCurrentUser());
      Cookies.remove('astro-tk');
      localStorage.removeItem('role');
      queryClient.clear();
      router.push('/login');
      return;
    }

    if (data?.user) {
      let resolvedRole = 'GUEST';
      if (
        Array.isArray(data?.user?.subscriptions) &&
        data?.user?.subscriptions?.length > 0
      ) {
        const planName = data?.user.subscriptions[0]?.plan?.name;
        if (planName === 'CLASSIC') resolvedRole = 'CLASSIC';
        if (planName === 'PREMIER') resolvedRole = 'PREMIER';
      } else {
        resolvedRole = 'GUEST';
      }

      localStorage.setItem('role', resolvedRole);
      dispatch(setCurrentUser({ user: data?.user, token }));
    }
  }, [data, error, dispatch, router, queryClient]);

  return { isLoading };
};
