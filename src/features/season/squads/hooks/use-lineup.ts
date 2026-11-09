import { useQuery } from '@tanstack/react-query';
import { useSelectedSeason } from '@/features/admin/seasons';
import { getLineup } from '../api';

export const useLineup = (teamId: string | undefined, enabled = true) => {
  const { selectedSeason } = useSelectedSeason();
  const seasonId = selectedSeason?.id;

  return useQuery({
    queryKey: ['lineup', seasonId, teamId],
    queryFn: () => getLineup(teamId as string),
    enabled: !!seasonId && !!teamId && enabled,
  });
};
