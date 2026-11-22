import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getClub } from '../api';

export const useClub = (id: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.club.detail(id),
    queryFn: () => getClub(id as string),
    enabled: enabled && !!id,
  });
};
