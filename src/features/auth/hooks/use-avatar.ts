import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getAvatar } from '../api';

export const useAvatar = () => {
  const { data, ...rest } = useQuery({
    queryKey: queryKeys.avatar,
    queryFn: getAvatar,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { ...rest, url: data ?? null };
};
