import { useQuery } from '@tanstack/react-query';
import { getAvatar } from '../api';

const ONE_DAY = 24 * 60 * 60 * 1000; // 24h em ms

export const useAvatar = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['avatar'],
    queryFn: getAvatar,
    retry: false,
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
  });

  return { ...rest, url: data ?? null };
};
