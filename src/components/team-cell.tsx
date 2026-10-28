import { cn } from '@/lib';

type Size = 'sm' | 'md' | 'lg';

const SIZE_STYLE: Record<Size, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

type TeamCellProps = {
  crestUrl: string;
  name: string;
  size?: Size;
};

export const TeamCell = ({ crestUrl, name, size = 'md' }: TeamCellProps) => {
  return (
    <div className={'flex items-center gap-2'}>
      <img
        src={crestUrl}
        alt={name}
        className={cn('object-contain', SIZE_STYLE[size])}
      />
      <span>{name}</span>
    </div>
  );
};
