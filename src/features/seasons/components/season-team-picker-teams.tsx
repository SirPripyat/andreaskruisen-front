import { cn } from 'cn';
import { OverallRatingBadge, TeamCell } from '@/components';
import type { TeamWithRatings } from '@/features/teams';

type SeasonTeamPickerTeamsProps = {
  excludeTeamIds: Set<string>;
  team: TeamWithRatings;
  pickTeam: (team: TeamWithRatings) => void;
};

const TeamAlreadyPicked = () => (
  <span
    className={cn(
      'absolute inset-0 flex items-center justify-center rounded-lg bg-surface/80',
      'text-muted-foreground text-xs font-medium',
    )}
  >
    Já atribuído
  </span>
);

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
