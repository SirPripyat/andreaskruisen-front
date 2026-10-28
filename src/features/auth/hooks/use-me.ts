import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useUserStore } from '@/stores';
import { getMe } from '../api';

const GC_TIME = 15 * 10 * 1000; // 15 min em ms

export function useMe() {
  const setUser = useUserStore((s) => s.setUser);
  const { isSuccess, data, ...rest } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    gcTime: GC_TIME,
  });

  useEffect(() => {
    if (isSuccess) {
      setUser({
        name: data.name,
        role: data.role,
      });
    }
  }, [isSuccess, data?.name, data?.role, setUser]);

  return {
    ...rest,
    isSuccess,
    data,
  };
}
