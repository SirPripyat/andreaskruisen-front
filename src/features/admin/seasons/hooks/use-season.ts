import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getSeason } from '../api';

export const useSeason = (id: string | undefined, open: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.seasons.detail(id),
    queryFn: () => getSeason(id as string),
    enabled: open && !!id,
  });
};
