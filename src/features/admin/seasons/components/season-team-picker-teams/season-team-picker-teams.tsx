import { cn } from 'cn';
import { OverallRatingBadge, TeamCell } from '@/components';
import type { TeamWithRatings } from '@/features/admin/teams';
import { TeamAlreadyPicked } from './team-already-picked';

type SeasonTeamPickerTeamsProps = {
  excludeTeamIds: Set<string>;
  team: TeamWithRatings;
  pickTeam: (team: TeamWithRatings) => void;
};

export const SeasonTeamPickerTeams = ({
  excludeTeamIds,
  team,
  pickTeam,
}: SeasonTeamPickerTeamsProps) => {
  const isTaken = excludeTeamIds.has(team.id);

  return (
    <button
      key={team.id}
      type={'button'}
      disabled={isTaken}
      onClick={() => pickTeam(team)}
      className={cn(
        'cursor-pointer relative flex items-center justify-between gap-2 rounded-lg',
        'border p-2 text-left text-sm hover:border-primary hover:bg-accent-surface',
        isTaken && 'opacity-50 hover:border-border',
      )}
    >
      <TeamCell crestUrl={team.crestUrl} name={team.name} size="sm" />
      <OverallRatingBadge rating={team.averageOverallRating} />

      {isTaken && <TeamAlreadyPicked />}
    </button>
  );
};
