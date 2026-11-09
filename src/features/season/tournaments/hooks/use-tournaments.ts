import { useQuery } from '@tanstack/react-query';
import { useSelectedSeason } from '@/features/admin/seasons';
import { listTournaments } from '../api';

export const useTournaments = () => {
  const { selectedSeason } = useSelectedSeason();
  const seasonId = selectedSeason?.id;

  return useQuery({
    queryKey: ['tournaments', seasonId],
    queryFn: () => listTournaments(),
    enabled: !!seasonId,
  });
};
