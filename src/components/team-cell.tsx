import { cn } from '@/lib';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_STYLE: Record<Size, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
  xl: 'size-12',
};

type TeamCellProps = {
  crestUrl: string;
  name: string;
  size?: Size;
  leagueName?: string;
  formation?: string | null;
};

export const TeamCell = ({
  crestUrl,
  name,
  size = 'md',
  leagueName,
  formation,
}: TeamCellProps) => {
  return (
    <div className={'flex items-center gap-2'}>
      <img
        src={crestUrl}
        alt={name}
        className={cn('object-contain', SIZE_STYLE[size])}
      />
      <div className="flex flex-col gap-1">
        <span>{name}</span>

        {leagueName && (
          <div
            className={
              'flex items-center gap-1.5 text-muted-foreground text-xs'
            }
          >
            <span>{leagueName}</span>
            <span>·</span>
            <span className={'font-mono'}>{formation ?? 'Sem formação'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
