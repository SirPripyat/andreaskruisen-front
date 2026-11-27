import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getOverallAtPosition } from '@/features/season/squads';
import {
  cn,
  getInitials,
  getOverallRatingClassName,
  getPositionGroupClassName,
} from '@/lib';
import type { PitchSlot } from './pitch-layout';

type PitchPlayerSlotMobileProps = {
  slot: PitchSlot;
  editable: boolean;
  onTap: () => void;
};

// Fora da edição, o toque avisa o pai pra abrir o detalhe do jogador. Dentro
// da edição, o toque abre o modal de substituição (ver TeamLineupTabMobile)
// com os candidatos pra entrar nessa posição — sem arraste.
export const PitchPlayerSlotMobile = ({
  slot,
  editable,
  onTap,
}: PitchPlayerSlotMobileProps) => {
  const { player, position } = slot;

  return (
    <button
      type={'button'}
      onClick={onTap}
      disabled={!editable && !player}
      aria-label={
        player
          ? `${player.name} — ${player.position} — overall ${Math.round(getOverallAtPosition(player, player.position))}`
          : `Vaga livre — ${position}`
      }
      className={cn(
        'flex w-20 flex-col items-center gap-1 rounded-xl p-1 outline-none',
        (editable || player) && 'cursor-pointer',
      )}
    >
      {player ? (
        <div
          className={cn(
            'relative rounded-full ring-2 transition-colors',
            editable ? 'ring-accent/40' : 'ring-transparent',
          )}
        >
          <Avatar
            className={
              'size-14 border-none bg-transparent after:border-transparent'
            }
          >
            <AvatarImage src={player.photoUrl} alt={player.name} />
            <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
          </Avatar>

          <div
            className={cn(
              '-top-1 -left-1.5 absolute flex size-6 items-center justify-center rounded-full font-bold text-[10px]',
              getPositionGroupClassName(player.position),
            )}
          >
            {player.position}
          </div>

          <div
            className={cn(
              '-top-1 -right-1.5 absolute flex size-6 items-center justify-center rounded-full font-bold text-[10px]',
              getOverallRatingClassName(
                Math.round(getOverallAtPosition(player, player.position)),
              ),
            )}
          >
            {Math.round(getOverallAtPosition(player, player.position))}
          </div>
        </div>
      ) : (
        <div
          role={'img'}
          aria-label={`Vaga livre — ${position}`}
          className={cn(
            'flex size-12 items-center justify-center rounded-full border-2 border-dashed font-bold text-[10px] transition-colors',
            editable
              ? 'border-accent/60 bg-accent/10 text-accent'
              : 'border-white/40 bg-white/5 text-white/50',
          )}
        >
          {position}
        </div>
      )}

      {player && (
        <span
          className={
            'max-w-full truncate rounded bg-black/70 px-1.5 py-0.5 font-sans font-semibold text-[11px] text-white'
          }
        >
          {player.name}
        </span>
      )}
    </button>
  );
};
