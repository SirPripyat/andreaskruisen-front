import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getCoinTransactions } from '../api';

export const useCoinTransactions = (
  teamId: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.coinTransactions.detail(teamId),
    queryFn: () => getCoinTransactions(teamId as string),
    enabled: !!teamId && enabled,
  });
};
