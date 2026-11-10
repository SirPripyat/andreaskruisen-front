import { useQuery } from '@tanstack/react-query';
import type { ListPlayersQuery } from '@/features/admin/players';
import { useSelectedSeason } from '@/features/admin/seasons';
import { listSeasonPlayers } from '../api';

export const useSeasonPlayers = (query: ListPlayersQuery) => {
  const { selectedSeason } = useSelectedSeason();
  const seasonId = selectedSeason?.id;

  return useQuery({
    queryKey: ['season-players', seasonId, query],
    queryFn: () => listSeasonPlayers(query),
    enabled: !!seasonId,
    placeholderData: (previousData) => previousData,
  });
};
