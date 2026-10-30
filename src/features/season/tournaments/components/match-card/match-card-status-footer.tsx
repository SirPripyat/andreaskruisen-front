import { cn } from '@/lib';
import { MatchCardAction } from './match-card-action';
import type { MatchStatus } from './match-status';

type MatchStatusFooterProps = {
  matchId: string;
  status: MatchStatus;
  onRegisterGoals?: (matchId: string) => void;
};

export const MatchCardStatusFooter = ({
  matchId,
  status,
  onRegisterGoals,
}: MatchStatusFooterProps) => {
  return (
    <div
      className={
        'flex items-center justify-between border-t pt-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide'
      }
    >
      <span className={cn('rounded-full px-2 py-0.5 bg-background')}>
        {status.played ? 'Encerrado' : 'A definir'}
      </span>

      <MatchCardAction
        matchId={matchId}
        locked={status.locked}
        onRegisterGoals={onRegisterGoals}
        size="icon-sm"
      />
    </div>
  );
};
