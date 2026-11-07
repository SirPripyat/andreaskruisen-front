import { cn } from '@/lib';
import type { TeamOwner } from '../../api';
import { TeamChip } from '../team-chip';

type MatchCardTeamProps = {
  teamId: string;
  name: string;
  crestUrl: string;
  owner: TeamOwner | null;
  score: number | null;
  // Placar da disputa de pênaltis dessa equipe — só existe quando a partida
  // é de mata-mata e empata no tempo normal.
  penaltyScore?: number | null;
  muted: boolean;
  winner: boolean;
};

export const MatchCardTeam = ({
  teamId,
  name,
  crestUrl,
  owner,
  score,
  penaltyScore,
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

      {penaltyScore != null && (
        <span
          className={cn(
            'shrink-0 font-mono text-muted-foreground text-xs tabular-nums',
            winner && 'font-semibold text-success',
          )}
        >
          ({penaltyScore})
        </span>
      )}

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
