import { cn } from '@/lib';

type MatchRoundTitleProps = {
  isCurrentRound?: boolean;
  roundLabel?: string;
};

export const MatchRoundTitle = ({
  isCurrentRound,
  roundLabel,
}: MatchRoundTitleProps) => {
  if (!roundLabel) return;

  return (
    <div className={'flex items-center justify-center gap-2'}>
      <span
        className={cn(
          'shrink-0 font-display font-bold text-sm uppercase',
          isCurrentRound ? 'text-foreground' : 'text-muted-foreground/70',
        )}
      >
        {roundLabel}
      </span>
    </div>
  );
};
