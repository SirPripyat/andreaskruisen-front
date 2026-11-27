import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getTransferQuote } from '../api';

export const useTransferQuote = (
  outgoingPlayerIds: string[],
  incomingPlayerIds: string[],
  useCoupon: boolean,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: queryKeys.transfers.quote(
      outgoingPlayerIds,
      incomingPlayerIds,
      useCoupon,
    ),
    queryFn: () =>
      getTransferQuote({ outgoingPlayerIds, incomingPlayerIds, useCoupon }),
    enabled,
    retry: false,
  });
};
