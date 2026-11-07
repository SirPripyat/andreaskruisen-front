import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import {
  cn,
  getInitials,
  getOverallRatingClassName,
  getPositionGroupClassName,
} from '@/lib';
import { measureTextWidth } from './measure-text-width';
import type { PitchSlot } from './pitch-layout';

const MARKER_WIDTH = 96;
const MARKER_HEIGHT = 84;
const NAME_OFFSET_Y = 42;
const NAME_FONT_SIZE = 13;
const NAME_FONT_WEIGHT = 600;
const NAME_BG_PADDING_X = 8;
const NAME_BG_MIN_WIDTH = 40;
const NAME_BG_HEIGHT = 18;

export const PlayerXILineup = ({
  slot,
  selected,
  onSelect,
}: {
  slot: PitchSlot;
  selected: boolean;
  onSelect: (playerId: string) => void;
}) => {
  const { player, x, y } = slot;

  const markerY = y - 8;

  const nameBgWidth = Math.max(
    NAME_BG_MIN_WIDTH,
    measureTextWidth(player.name, NAME_FONT_SIZE, NAME_FONT_WEIGHT) +
      NAME_BG_PADDING_X * 2,
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: a <button> can't host the <rect>/<text> siblings this marker needs outside the foreignObject
    <g
      role="button"
      tabIndex={0}
      aria-label={`${player.name} — ${player.position} — overall ${Math.round(player.overallRating)}`}
      className="cursor-pointer outline-none"
      onClick={() => onSelect(player.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(player.id);
        }
      }}
    >
      <rect
        x={x - MARKER_WIDTH / 2}
        y={markerY - MARKER_HEIGHT / 2}
        width={MARKER_WIDTH}
        height={MARKER_HEIGHT + 40}
        fill={'transparent'}
      />

      <foreignObject
        x={x - MARKER_WIDTH / 2}
        y={markerY - MARKER_HEIGHT / 2}
        width={MARKER_WIDTH}
        height={MARKER_HEIGHT}
        overflow={'visible'}
      >
        <div className={'flex flex-col items-center'}>
          <div
            className={cn(
              'relative rounded-full',
              selected && 'outline-2 outline-accent outline-offset-2',
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
                getOverallRatingClassName(Math.round(player.overallRating)),
              )}
            >
              {Math.round(player.overallRating)}
            </div>
          </div>
        </div>
      </foreignObject>

      <rect
        x={x - nameBgWidth / 2}
        y={markerY + NAME_OFFSET_Y - NAME_BG_HEIGHT + 5}
        width={nameBgWidth}
        height={NAME_BG_HEIGHT}
        rx={4}
        className={'pointer-events-none'}
        fill={'rgba(10, 10, 15)'}
      />
      <text
        x={x}
        y={markerY + NAME_OFFSET_Y}
        textAnchor={'middle'}
        fontSize={NAME_FONT_SIZE}
        fontWeight={NAME_FONT_WEIGHT}
        className={'pointer-events-none select-none font-sans'}
        fill={'#f5f3ef'}
      >
        {player.name}
      </text>
    </g>
  );
};
