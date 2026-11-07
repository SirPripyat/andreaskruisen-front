import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Skeleton,
} from '@/components/ui';
import type { RosterPlayer } from '@/features/season/squads';
import {
  cn,
  getInitials,
  getOverallRatingClassName,
  getPositionGroupClassName,
} from '@/lib';

const SKELETON_ROW_KEYS = Array.from(
  { length: 5 },
  (_, index) => `bench-skeleton-${index}`,
);

type TeamLineupBenchProps = {
  bench: RosterPlayer[];
  isPending: boolean;
  selectedId: string | null;
  onSelect: (playerId: string) => void;
};

export const TeamLineupBench = ({
  bench,
  isPending,
  selectedId,
  onSelect,
}: TeamLineupBenchProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="flex items-baseline justify-between font-display font-bold text-sm uppercase tracking-wide">
        Banco de reservas
        <span className="font-mono font-normal text-[11px] text-muted-foreground normal-case tracking-normal">
          {bench.length} {bench.length === 1 ? 'jogador' : 'jogadores'}
        </span>
      </h3>

      <div className="flex flex-col divide-y divide-border rounded-lg border">
        {isPending &&
          SKELETON_ROW_KEYS.map((key) => (
            <Skeleton key={key} className="m-2 h-9" />
          ))}

        {!isPending && bench.length === 0 && (
          <p className="p-4 text-center text-muted-foreground text-xs">
            Nenhum reserva registrado nesta temporada.
          </p>
        )}

        {!isPending &&
          bench.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => onSelect(player.id)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-muted/50 cursor-pointer',
                selectedId === player.id && 'bg-muted/60 ',
              )}
            >
              <Avatar>
                <AvatarImage src={player.photoUrl} alt="" />
                <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-sm">
                  {player.name}
                </span>
                <span
                  className={cn(
                    'w-fit rounded px-1 font-mono text-[10px]',
                    getPositionGroupClassName(player.position),
                  )}
                >
                  {player.position}
                </span>
              </span>
              <Badge
                variant="outline"
                className={getOverallRatingClassName(
                  Math.round(player.overallRating),
                )}
              >
                {Math.round(player.overallRating)}
              </Badge>
            </button>
          ))}
      </div>
    </div>
  );
};
