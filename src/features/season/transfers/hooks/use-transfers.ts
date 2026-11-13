import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listTransfers } from '../api';

export const useTransfers = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.transfers,
    queryFn: () => listTransfers(),
    enabled: enabled,
  });
};
