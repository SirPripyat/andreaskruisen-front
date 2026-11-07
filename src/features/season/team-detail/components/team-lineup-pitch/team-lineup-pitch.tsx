import { Skeleton } from '@/components/ui';
import type { Formation, RosterPlayer } from '@/features/season/squads';
import { PITCH_HEIGHT, PITCH_WIDTH } from './pitch-dimensions';
import { PitchField } from './pitch-field';
import { buildPitchSlots } from './pitch-layout';
import { PlayerXILineup } from './player-xi-lineup';

export const TeamLineupPitch = ({
  lineup,
  formation,
  isPending,
  selectedId,
  onSelect,
}: {
  lineup: RosterPlayer[];
  formation: Formation | null;
  isPending: boolean;
  selectedId: string | null;
  onSelect: (playerId: string) => void;
}) => {
  if (isPending) {
    return (
      <Skeleton
        className="mx-auto w-full max-w-xl"
        style={{ aspectRatio: `${PITCH_WIDTH} / ${PITCH_HEIGHT}` }}
      />
    );
  }

  const slots = buildPitchSlots(lineup, formation);

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
      {slots.map((slot) => (
        <PlayerXILineup
          key={slot.player.id}
          slot={slot}
          selected={slot.player.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </svg>
  );
};
