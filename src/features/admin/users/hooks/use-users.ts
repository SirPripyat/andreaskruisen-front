import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listUsers } from '../api';

export const useUsers = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: listUsers,
    enabled: options?.enabled ?? true,
  });
};
