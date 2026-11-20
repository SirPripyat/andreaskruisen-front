import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getNegotiationWindow } from '../api';

export const useNegotiationWindowStatus = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.negotiationWindow.status,
    queryFn: getNegotiationWindow,
    enabled,
  });
};
