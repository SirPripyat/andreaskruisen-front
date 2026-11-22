import { CheckCircle2Icon, ClockIcon } from 'lucide-react';
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
        'flex items-center justify-between gap-2 border-t pt-1.5 text-[11px] text-muted-foreground'
      }
    >
      <span className={'flex items-center gap-1.5'}>
        {status.played ? (
          <CheckCircle2Icon className={'size-3.5'} />
        ) : (
          <ClockIcon className={'size-3.5'} />
        )}
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
