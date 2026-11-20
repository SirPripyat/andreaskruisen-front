import { useDraggable, useDroppable } from '@dnd-kit/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Skeleton,
} from '@/components/ui';
import {
  getOverallAtPosition,
  type RosterPlayer,
} from '@/features/season/squads';
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
  editable: boolean;
  selectedId: string | null;
  onSelect: (playerId: string) => void;
};

export const TeamLineupBench = ({
  bench,
  isPending,
  editable,
  selectedId,
  onSelect,
}: TeamLineupBenchProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'bench',
    data: { type: 'bench' },
  });

  return (
    <div className={'flex flex-col gap-2'}>
      <h3
        className={
          'flex items-baseline justify-between font-display font-bold text-sm uppercase tracking-wide'
        }
      >
        Banco de reservas
        <span
          className={
            'font-mono font-normal text-[11px] text-muted-foreground normal-case tracking-normal'
          }
        >
          {bench.length} {bench.length === 1 ? 'jogador' : 'jogadores'}
        </span>
      </h3>

      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col divide-y divide-border rounded-lg border transition-colors',
          editable && isOver && 'border-accent bg-accent/10',
        )}
      >
        {isPending &&
          SKELETON_ROW_KEYS.map((key) => (
            <Skeleton key={key} className={'m-2 h-9'} />
          ))}

        {!isPending && bench.length === 0 && (
          <p className={'p-4 text-center text-muted-foreground text-xs'}>
            Nenhum reserva registrado nesta temporada.
          </p>
        )}

        {!isPending &&
          bench.map((player) => (
            <TeamLineupBenchRow
              key={player.id}
              player={player}
              editable={editable}
              selected={selectedId === player.id}
              onSelect={onSelect}
            />
          ))}
      </div>
    </div>
  );
};

type TeamLineupBenchRowProps = {
  player: RosterPlayer;
  editable: boolean;
  selected: boolean;
  onSelect: (playerId: string) => void;
};

const TeamLineupBenchRow = ({
  player,
  editable,
  selected,
  onSelect,
}: TeamLineupBenchRowProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `player:${player.id}`,
    data: { origin: 'bench', playerId: player.id },
    disabled: !editable,
  });

  return (
    <button
      ref={setNodeRef}
      type={'button'}
      {...listeners}
      {...attributes}
      onClick={() => {
        if (!editable) onSelect(player.id);
      }}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-muted/50',
        editable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        selected && 'bg-muted/60',
        isDragging && 'opacity-30',
      )}
    >
      <Avatar>
        <AvatarImage src={player.photoUrl} alt={''} />
        <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
      </Avatar>
      <span className={'flex min-w-0 flex-1 flex-col'}>
        <span className={'truncate font-medium text-sm'}>{player.name}</span>
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
        variant={'outline'}
        className={getOverallRatingClassName(
          Math.round(getOverallAtPosition(player, player.position)),
        )}
      >
        {Math.round(getOverallAtPosition(player, player.position))}
      </Badge>
    </button>
  );
};
