import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getTransferQuote } from '../api';

export const useTransferQuote = (
  outgoingPlayerId: string,
  incomingPlayerId: string,
  useCoupon: boolean,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: queryKeys.transfers.quote(
      outgoingPlayerId,
      incomingPlayerId,
      useCoupon,
    ),
    queryFn: () =>
      getTransferQuote({ outgoingPlayerId, incomingPlayerId, useCoupon }),
    enabled,
    retry: false,
  });
};
