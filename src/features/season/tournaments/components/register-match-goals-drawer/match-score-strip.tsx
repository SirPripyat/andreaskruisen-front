import { TrophyIcon } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib';
import type { MatchDetail } from '../../types';
import { TeamChip } from '../team-chip';

export const MatchScoreStrip = ({
  match,
  homeGoals,
  awayGoals,
  readOnly,
}: {
  match: MatchDetail;
  homeGoals: number;
  awayGoals: number;
  readOnly: boolean;
}) => {
  const { penalties } = match;

  return (
    <div className="flex flex-col items-center gap-3 border-b border-dashed pb-5">
      <div className="flex w-full items-center justify-center gap-4">
        <TeamChip
          className="flex-1"
          name={match.homeTeam.name}
          crestUrl={match.homeTeam.crestUrl}
        />
        <div className="flex shrink-0 items-center gap-2 font-mono font-bold text-3xl tabular-nums">
          <span className="text-accent">{homeGoals}</span>
          <span className="text-muted-foreground text-xl">–</span>
          <span>{awayGoals}</span>
        </div>
        <TeamChip
          className="flex-1"
          name={match.awayTeam.name}
          crestUrl={match.awayTeam.crestUrl}
          align="right"
        />
      </div>

      {readOnly && penalties && (
        <Badge
          variant="outline"
          className="gap-1.5 border-transparent bg-muted text-muted-foreground"
        >
          <span>Pênaltis</span>
          <span
            className={cn(
              'font-mono font-semibold tabular-nums',
              penalties.winnerTeamId === match.homeTeam.id && 'text-success',
            )}
          >
            {penalties.homeScore}
          </span>
          <span>x</span>
          <span
            className={cn(
              'font-mono font-semibold tabular-nums',
              penalties.winnerTeamId === match.awayTeam.id && 'text-success',
            )}
          >
            {penalties.awayScore}
          </span>
          <TrophyIcon className="size-3 text-success" />
        </Badge>
      )}
    </div>
  );
};
