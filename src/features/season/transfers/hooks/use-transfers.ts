import { useQuery } from '@tanstack/react-query';
import { useSelectedSeason } from '@/features/admin/seasons';
import { listTransfers } from '../api';

export const useTransfers = (enabled = true) => {
  const { selectedSeason } = useSelectedSeason();
  const seasonId = selectedSeason?.id;

  return useQuery({
    queryKey: ['transfers', seasonId],
    queryFn: () => listTransfers(),
    enabled: !!seasonId && enabled,
  });
};
