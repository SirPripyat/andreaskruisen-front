import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getClubTitles } from '../api';

export const useClubTitles = (id: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.club.titles(id),
    queryFn: () => getClubTitles(id as string),
    enabled: !!id && enabled,
  });
};
