import { useQuery } from '@tanstack/react-query';
import { useSeasonSelection } from '@/features/admin';
import { getRoster } from '../api';

export function useRoster(teamId: string | undefined, enabled = true) {
  const { selectedSeason } = useSeasonSelection();

  const seasonId = selectedSeason?.id;

  return useQuery({
    queryKey: ['roster', selectedSeason, teamId],
    queryFn: () => getRoster(seasonId as string, teamId as string),
    enabled: !!seasonId && !!teamId && enabled,
  });
}
