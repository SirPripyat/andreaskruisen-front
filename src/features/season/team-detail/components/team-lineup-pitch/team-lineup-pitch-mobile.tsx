import { Skeleton } from '@/components/ui';
import type { Formation, RosterPlayer } from '@/features/season/squads';
import { PITCH_HEIGHT, PITCH_WIDTH } from './pitch-dimensions';
import { PitchField } from './pitch-field';
import { buildPitchSlots, type PitchSlot } from './pitch-layout';
import { PitchPlayerSlotMobile } from './pitch-player-slot-mobile';

type TeamLineupPitchMobileProps = {
  starters: RosterPlayer[];
  formation: Formation | null;
  isPending: boolean;
  editable: boolean;
  onTapSlot: (slot: PitchSlot) => void;
};

// O campo continua desenhado (mesmo <PitchField/> do desktop) e os
// titulares na posição exata da formação — só que, em vez de embutir os
// marcadores num `foreignObject` SVG (o que o Safari renderiza mal), eles
// ficam numa camada HTML comum por cima, posicionada em % a partir das
// mesmas coordenadas que o desktop já calcula (buildPitchSlots). O SVG de
// fundo não tem HTML embutido, então não sofre do bug.
export const TeamLineupPitchMobile = ({
  starters,
  formation,
  isPending,
  editable,
  onTapSlot,
}: TeamLineupPitchMobileProps) => {
  if (isPending) {
    return (
      <Skeleton
        className={'mx-auto w-full max-w-xl'}
        style={{ aspectRatio: `${PITCH_WIDTH} / ${PITCH_HEIGHT}` }}
      />
    );
  }

  const slots = buildPitchSlots(starters, formation);

  return (
    <div
      className={
        'relative mx-auto w-full max-w-xl overflow-hidden rounded-xl border'
      }
      style={{ aspectRatio: `${PITCH_WIDTH} / ${PITCH_HEIGHT}` }}
    >
      <svg
        viewBox={`0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`}
        className={'absolute inset-0 block h-full w-full'}
        aria-hidden={'true'}
      >
        <PitchField />
      </svg>

      {slots.map((slot, index) => (
        <div
          key={slot.player?.id ?? `empty-${index}`}
          className={'absolute -translate-x-1/2 -translate-y-1/2'}
          style={{
            left: `${(slot.x / PITCH_WIDTH) * 100}%`,
            top: `${(slot.y / PITCH_HEIGHT) * 100}%`,
          }}
        >
          <PitchPlayerSlotMobile
            slot={slot}
            editable={editable}
            onTap={() => onTapSlot(slot)}
          />
        </div>
      ))}
    </div>
  );
};
