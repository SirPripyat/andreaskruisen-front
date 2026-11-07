import { useQuery } from '@tanstack/react-query';
import { listLeagues } from '../api';

export function useLeagues() {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: listLeagues,
  });
}
