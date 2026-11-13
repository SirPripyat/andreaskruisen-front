import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listFavorites } from '../api';

export const useFavorites = () => {
  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: listFavorites,
  });
};
