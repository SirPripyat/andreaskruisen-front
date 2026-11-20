import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getOverallAtPosition } from '@/features/season/squads';
import {
  cn,
  getInitials,
  getOverallRatingClassName,
  getPositionGroupClassName,
} from '@/lib';
import type { PitchSlot } from './pitch-layout';

const MARKER_WIDTH = 104;
const MARKER_HEIGHT = 118;

type PitchPlayerSlotProps = {
  slot: PitchSlot;
  slotId: string;
  editable: boolean;
  onSelect: (playerId: string) => void;
};

// Um slot do campo é sempre um alvo de drop (useDroppable) — com ou sem
// titular — e, quando tem titular e a edição está ligada, também vira uma
// origem de drag (useDraggable) pro técnico arrastar pra outro slot ou pro
// banco. Slot vazio só recebe (arrastar um reserva, ou outro titular, pra
// ele); fora do modo de edição, clicar abre os detalhes do jogador.
export const PitchPlayerSlot = ({
  slot,
  slotId,
  editable,
  onSelect,
}: PitchPlayerSlotProps) => {
  const { player, x, y, position } = slot;

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: slotId,
    data: { type: 'slot', playerId: player?.id ?? null, position },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id: player ? `player:${player.id}` : `${slotId}:empty`,
    data: player ? { origin: 'pitch', playerId: player.id } : undefined,
    disabled: !editable || !player,
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setDroppableRef(node);
    setDraggableRef(node);
  };

  return (
    <foreignObject
      x={x - MARKER_WIDTH / 2}
      y={y - MARKER_HEIGHT / 2 + 10}
      width={MARKER_WIDTH}
      height={MARKER_HEIGHT}
      overflow={'visible'}
    >
      {player ? (
        <button
          ref={setNodeRef}
          type={'button'}
          {...listeners}
          {...attributes}
          onClick={() => {
            if (!editable) onSelect(player.id);
          }}
          aria-label={`${player.name} — ${player.position} — overall ${Math.round(getOverallAtPosition(player, player.position))}`}
          className={cn(
            'flex w-full flex-col items-center gap-1 rounded-xl p-1 outline-none',
            editable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
            isDragging && 'opacity-30',
          )}
        >
          <div
            className={cn(
              'relative rounded-full ring-2 ring-transparent transition-colors',
              isOver && 'ring-accent',
            )}
          >
            <Avatar
              className={
                'size-20 border-none bg-transparent after:border-transparent'
              }
            >
              <AvatarImage src={player.photoUrl} alt={player.name} />
              <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
            </Avatar>

            <div
              className={cn(
                '-top-1 -left-2 absolute flex size-9 items-center justify-center rounded-full font-bold text-sm',
                getPositionGroupClassName(player.position),
              )}
            >
              {player.position}
            </div>

            <div
              className={cn(
                '-top-1 -right-2 absolute flex size-9 items-center justify-center rounded-full font-bold text-sm',
                getOverallRatingClassName(
                  Math.round(getOverallAtPosition(player, player.position)),
                ),
              )}
            >
              {Math.round(getOverallAtPosition(player, player.position))}
            </div>
          </div>

          <span
            className={
              'max-w-full truncate rounded bg-black/70 px-2 py-0.5 font-sans font-semibold text-[13px] text-white'
            }
          >
            {player.name}
          </span>
        </button>
      ) : (
        <div
          ref={setDroppableRef}
          className={'flex h-full flex-col items-center justify-center'}
        >
          <div
            role={'img'}
            aria-label={`Vaga livre — ${position}`}
            className={cn(
              'flex size-16 items-center justify-center rounded-full border-2 border-dashed font-bold text-xs transition-colors',
              isOver
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-white/40 bg-white/5 text-white/50',
            )}
          >
            {position}
          </div>
        </div>
      )}
    </foreignObject>
  );
};
