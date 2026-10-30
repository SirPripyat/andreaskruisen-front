import { cn } from '@/lib';
import type { MatchListItem } from '../../api';
import { MatchCardStatusFooter } from './match-card-status-footer';
import { MatchCardTeam } from './match-card-team';
import type { MatchStatus } from './match-status';

type MatchCardColumnProps = {
  cardRef?: (el: HTMLDivElement | null) => void;
  cardClassName?: string;
  match: MatchListItem;
  status: MatchStatus;
  onRegisterGoals?: (matchId: string) => void;
  isFinal?: boolean;
};

export const MatchCardColumn = ({
  cardRef,
  cardClassName,
  match,
  status,
  isFinal,
  onRegisterGoals,
}: MatchCardColumnProps) => {
  return (
    <div
      ref={cardRef}
      className={cn(
        'flex flex-col gap-1.5 rounded-xl border bg-card p-2.5 shadow-sm',
        isFinal && 'border-t-4 border-t-value',
        cardClassName,
      )}
    >
      <MatchCardTeam
        teamId={match.homeTeam.id}
        name={match.homeTeam.name}
        crestUrl={match.homeTeam.crestUrl}
        owner={match.homeTeam.owner}
        score={match.homeScore}
        muted={status.awayWinner}
        winner={status.homeWinner}
      />

      <MatchCardTeam
        teamId={match.awayTeam.id}
        name={match.awayTeam.name}
        crestUrl={match.awayTeam.crestUrl}
        owner={match.awayTeam.owner}
        score={match.awayScore}
        muted={status.homeWinner}
        winner={status.awayWinner}
      />

      <MatchCardStatusFooter
        matchId={match.id}
        status={status}
        onRegisterGoals={onRegisterGoals}
      />
    </div>
  );
};
