import { useQuery } from '@tanstack/react-query';
import { listLeagues } from '../api';

export const useLeagues = () => {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: listLeagues,
  });
};
