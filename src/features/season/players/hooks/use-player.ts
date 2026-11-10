import { useQuery } from '@tanstack/react-query';
import { useSelectedSeason } from '@/features/admin/seasons';
import { getPlayer } from '../api';

export const usePlayer = (id: string | undefined) => {
  const { selectedSeason } = useSelectedSeason();
  const seasonId = selectedSeason?.id;

  return useQuery({
    queryKey: ['season-player', seasonId, id],
    queryFn: () => getPlayer(id as string),
    enabled: !!id && !!seasonId,
  });
};
