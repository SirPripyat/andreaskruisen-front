import { cn } from '@/lib';
import type { TeamOwner } from '../../api';
import { TeamChip } from '../team-chip';

type MatchCardTeamProps = {
  teamId: string;
  name: string;
  crestUrl: string;
  owner: TeamOwner | null;
  score: number | null;
  muted: boolean;
  winner: boolean;
};

export const MatchCardTeam = ({
  teamId,
  name,
  crestUrl,
  owner,
  score,
  muted,
  winner,
}: MatchCardTeamProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border-l-4 border-l-transparent px-2 py-1',
        winner && 'bg-success-surface',
      )}
    >
      <TeamChip
        className={cn('flex-1', muted && 'opacity-40')}
        teamId={teamId}
        name={name}
        crestUrl={crestUrl}
        owner={owner}
      />

      <div
        className={cn(
          'bg-background size-8 flex items-center justify-center rounded-lg',
        )}
      >
        {score ?? '-'}
      </div>
    </div>
  );
};
