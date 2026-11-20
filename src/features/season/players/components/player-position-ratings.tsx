import type { PlayerPositionRating } from '@/features/admin/players';
import { cn, getOverallRatingClassName } from '@/lib';

type PlayerPositionRatingsProps = {
  positionRatings: PlayerPositionRating[];
};

type PitchRow = {
  top: number;
  positions: string[];
};

const PITCH_ROWS: PitchRow[] = [
  { top: 8, positions: ['ATE', 'ATA', 'ATD'] },
  { top: 24, positions: ['PE', 'MAE', 'SA', 'MAD', 'PD'] },
  { top: 40, positions: ['MEE', 'MEI', 'MED'] },
  { top: 54, positions: ['ME', 'MCE', 'MC', 'MCD', 'MD'] },
  { top: 68, positions: ['ADE', 'VE', 'VOL', 'VD', 'ADD'] },
  { top: 82, positions: ['LE', 'ZGE', 'ZAG', 'ZGD', 'LD'] },
  { top: 95, positions: ['GOL'] },
];

const ROW_COLUMNS: Record<number, number[]> = {
  1: [50],
  3: [25, 50, 75],
  5: [8, 29, 50, 71, 92],
};

export const PlayerPositionRatings = ({
  positionRatings,
}: PlayerPositionRatingsProps) => {
  const ratingByPosition = new Map(
    positionRatings.map((positionRating) => [
      positionRating.position,
      positionRating,
    ]),
  );

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'border-b pb-3'}>
        <h2
          className={'font-display font-bold text-lg uppercase tracking-tight'}
        >
          Posições
        </h2>
      </div>

      <div
        className={
          'relative mx-auto aspect-[2/3] w-full max-w-sm rounded-xl border border-success/30 bg-success/5 p-2'
        }
      >
        <svg
          viewBox={'0 0 100 150'}
          preserveAspectRatio={'none'}
          className={'absolute inset-0 size-full text-success/30'}
          fill={'none'}
          stroke={'currentColor'}
          strokeWidth={0.6}
          aria-hidden={'true'}
        >
          <rect x={3} y={3} width={94} height={144} rx={1} />
          <line x1={3} y1={75} x2={97} y2={75} />
          <circle cx={50} cy={75} r={10} />
          <circle cx={50} cy={75} r={0.8} fill={'currentColor'} />
          <rect x={25} y={3} width={50} height={18} />
          <rect x={39} y={3} width={22} height={7} />
          <rect x={25} y={129} width={50} height={18} />
          <rect x={39} y={140} width={22} height={7} />
        </svg>

        {PITCH_ROWS.flatMap((row) => {
          const columns = ROW_COLUMNS[row.positions.length] ?? [];

          return row.positions.map((position, index) => {
            const positionRating = ratingByPosition.get(position);

            if (!positionRating) return null;

            return (
              <div
                key={position}
                className={
                  'absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5'
                }
                style={{ top: `${row.top}%`, left: `${columns[index]}%` }}
              >
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full font-display font-bold text-xs shadow-sm',
                    getOverallRatingClassName(positionRating.overall),
                    positionRating.natural && 'ring-2 ring-accent',
                  )}
                >
                  {positionRating.overall}
                </span>
                <span
                  className={
                    'rounded bg-card/90 px-1 font-semibold text-[9px] text-muted-foreground'
                  }
                >
                  {position}
                </span>
              </div>
            );
          });
        })}
      </div>

      <p className={'text-muted-foreground text-xs'}>
        {'Posições destacadas são naturais ao jogador.'}
      </p>
    </div>
  );
};
