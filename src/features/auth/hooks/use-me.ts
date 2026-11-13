import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queryKeys } from '@/lib';
import { useUserStore } from '@/stores';
import { getMe } from '../api';

export const useMe = () => {
  const setUser = useUserStore((s) => s.setUser);
  const { isSuccess, data, ...rest } = useQuery({
    queryKey: queryKeys.me.detail,
    queryFn: getMe,
    retry: false,
    gcTime: Infinity,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess) {
      setUser({
        name: data.name,
        role: data.role,
        selectedSeasonId: data.selectedSeasonId,
        teamId: data.teamId,
      });
    }
  }, [
    isSuccess,
    data?.name,
    data?.role,
    data?.selectedSeasonId,
    data?.teamId,
    setUser,
  ]);

  return {
    ...rest,
    isSuccess,
    data,
  };
};
