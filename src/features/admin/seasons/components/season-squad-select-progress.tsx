import { cn } from 'cn';

type SeasonSquadSelectProgressProps = {
  progress: number;
  isComplete: boolean;
};

export const SeasonSquadSelectProgress = ({
  progress,
  isComplete,
}: SeasonSquadSelectProgressProps) => (
  <div className={'h-1.5 w-full overflow-hidden rounded-full bg-muted'}>
    <div
      className={cn(
        'h-full rounded-full bg-primary transition-all',
        isComplete && 'bg-success',
      )}
      style={{ width: `${progress}%` }}
    />
  </div>
);
