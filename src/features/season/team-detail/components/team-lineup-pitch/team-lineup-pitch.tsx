import { Skeleton } from '@/components/ui';
import type { Formation, RosterPlayer } from '@/features/season/squads';
import { PITCH_HEIGHT, PITCH_WIDTH } from './pitch-dimensions';
import { PitchField } from './pitch-field';
import { buildPitchSlots } from './pitch-layout';
import { PitchPlayerSlot } from './pitch-player-slot';

type TeamLineupPitchProps = {
  starters: RosterPlayer[];
  formation: Formation | null;
  isPending: boolean;
  editable: boolean;
  onSelect: (playerId: string) => void;
};

export const TeamLineupPitch = ({
  starters,
  formation,
  isPending,
  editable,
  onSelect,
}: TeamLineupPitchProps) => {
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
    <svg
      viewBox={`0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`}
      className={
        'mx-auto block w-full max-w-xl overflow-hidden rounded-xl border'
      }
      aria-label={'Escalação titular no campo'}
    >
      <title>Escalação titular</title>
      <PitchField />
      {slots.map((slot, index) => (
        <PitchPlayerSlot
          key={slot.player?.id ?? `empty-${index}`}
          slot={slot}
          slotId={`slot-${index}`}
          editable={editable}
          onSelect={onSelect}
        />
      ))}
    </svg>
  );
};
