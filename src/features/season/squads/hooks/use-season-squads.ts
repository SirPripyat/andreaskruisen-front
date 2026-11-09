import { useQuery } from '@tanstack/react-query';
import { useSelectedSeason } from '@/features/admin/seasons';
import { listSquads } from '../api';

export const useSeasonSquads = (enabled = true) => {
  const { selectedSeason } = useSelectedSeason();
  const seasonId = selectedSeason?.id;

  return useQuery({
    queryKey: ['squads', seasonId],
    queryFn: () => listSquads(),
    enabled: !!seasonId && enabled,
  });
};
