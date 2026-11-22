import { cn } from '@/lib';
import type { TeamOwner } from '../../types';
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
    <div className={'flex items-center justify-between gap-2'}>
      <TeamChip
        className={cn('flex-1', muted && 'opacity-40')}
        teamId={teamId}
        name={name}
        crestUrl={crestUrl}
        owner={owner}
        bold={winner}
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

      <span
        className={cn(
          'shrink-0 min-w-4 text-right font-mono text-sm tabular-nums',
          winner ? 'font-bold' : 'font-medium',
        )}
      >
        {score ?? ''}
      </span>
    </div>
  );
};
