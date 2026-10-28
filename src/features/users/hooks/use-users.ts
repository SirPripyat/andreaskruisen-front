import { useQuery } from '@tanstack/react-query';
import { listUsers } from '../api';

export function useUsers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
    enabled: options?.enabled ?? true,
  });
}
