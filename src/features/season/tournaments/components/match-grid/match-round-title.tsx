import { DicesIcon } from 'lucide-react';
import { cn } from '@/lib';

type MatchRoundTitleProps = {
  isCurrentRound?: boolean;
  roundLabel?: string;
  pendingCount?: number;
  onSimulateRound?: () => void;
};

export const MatchRoundTitle = ({
  isCurrentRound,
  roundLabel,
  pendingCount,
  onSimulateRound,
}: MatchRoundTitleProps) => {
  if (!roundLabel) return;

  const showAction = !!onSimulateRound && !!pendingCount;

  return (
    <div
      className={cn(
        'grid items-center gap-2',
        showAction ? 'grid-cols-[1fr_auto_1fr]' : 'justify-center',
      )}
    >
      {showAction && <span />}

      <span
        className={cn(
          'shrink-0 justify-self-center font-display font-bold text-sm uppercase',
          isCurrentRound ? 'text-foreground' : 'text-muted-foreground/70',
        )}
      >
        {roundLabel}
      </span>

      {showAction && (
        <button
          type={'button'}
          onClick={onSimulateRound}
          className={
            'flex shrink-0 items-center justify-self-end gap-1 text-accent text-xs hover:underline'
          }
        >
          <DicesIcon className={'size-3'} />
          {'Simular rodada ('}
          {pendingCount}
          {')'}
        </button>
      )}
    </div>
  );
};
