import { useQuery } from '@tanstack/react-query';
import { listTransfers } from '../api';

export function useTransfers(seasonId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['transfers', seasonId],
    queryFn: () => listTransfers(seasonId as string),
    enabled: !!seasonId && enabled,
  });
}
