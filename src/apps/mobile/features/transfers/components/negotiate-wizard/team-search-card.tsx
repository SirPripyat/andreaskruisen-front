import { OverallRatingBadge } from '@/components';
import { cn } from '@/lib';

type TeamSearchCardProps = {
  name: string;
  crestUrl: string;
  subtitle: string;
  overall?: number;
  selected: boolean;
  onSelect: () => void;
};

export const TeamSearchCard = ({
  name,
  crestUrl,
  subtitle,
  overall,
  selected,
  onSelect,
}: TeamSearchCardProps) => {
  return (
    <button
      type={'button'}
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:bg-muted/40',
      )}
    >
      <span className={'flex items-center justify-between gap-2'}>
        <span className={'flex min-w-0 items-center gap-2'}>
          <img
            src={crestUrl}
            alt={''}
            className={'size-6 shrink-0 object-contain'}
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden';
            }}
          />
          <span className={'truncate font-display font-semibold text-sm'}>
            {name}
          </span>
        </span>
        {overall !== undefined && <OverallRatingBadge rating={overall} />}
      </span>
      <span className={'truncate text-muted-foreground text-xs'}>
        {subtitle}
      </span>
    </button>
  );
};
