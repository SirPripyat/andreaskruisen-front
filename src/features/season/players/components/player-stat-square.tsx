import { cn } from '@/lib';

type PlayerStatSquareProps = {
  label: string;
  value: string;
  sub: string;
  tierClassName?: string;
};

export const PlayerStatSquare = ({
  label,
  value,
  sub,
  tierClassName,
}: PlayerStatSquareProps) => {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-center justify-center rounded-md p-3 text-center',
        tierClassName,
      )}
    >
      <span className={'font-display font-bold text-2xl sm:text-3xl'}>
        {value}
      </span>
      <span className={'font-semibold text-[10px] uppercase tracking-wide'}>
        {label}
      </span>
      <span className={'text-[10px] opacity-80'}>{sub}</span>
    </div>
  );
};
