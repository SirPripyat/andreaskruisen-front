import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getNationality } from '../api';

export const useNationality = (
  id: string | undefined,
  open: boolean = true,
) => {
  return useQuery({
    queryKey: queryKeys.nationalities.detail(id),
    queryFn: () => getNationality(id as string),
    enabled: open && !!id,
  });
};
