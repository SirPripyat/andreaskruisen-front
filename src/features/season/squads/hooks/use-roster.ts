import { useQuery } from '@tanstack/react-query';
import { useSelectedSeason } from '@/features/admin/seasons';
import { getRoster } from '../api';

export const useRoster = (teamId: string | undefined, enabled = true) => {
  const { selectedSeason } = useSelectedSeason();
  const seasonId = selectedSeason?.id;

  return useQuery({
    queryKey: ['roster', seasonId, teamId],
    queryFn: () => getRoster(teamId as string),
    enabled: !!seasonId && !!teamId && enabled,
  });
};
