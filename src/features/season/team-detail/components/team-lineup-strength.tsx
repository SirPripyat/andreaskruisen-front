import { Progress } from '@/components/ui';
import type { RosterPlayer } from '@/features/season/squads';
import {
  getOverallRatingIndicatorClassName,
  getPositionGroup,
  getPositionGroupLabel,
  type PositionGroup,
} from '@/lib';

const GROUP_ORDER: PositionGroup[] = ['GOL', 'DEF', 'MID', 'ATT'];

type StrengthTile = {
  group: PositionGroup;
  average: number;
};

const getTiles = (starters: RosterPlayer[]) => {
  return GROUP_ORDER.map((group) => {
    const players = starters.filter(
      (player) => getPositionGroup(player.position) === group,
    );

    if (players.length === 0) return null;

    const average =
      players.reduce((sum, player) => sum + player.overallRating, 0) /
      players.length;

    return { group, average };
  }).filter((tile): tile is StrengthTile => tile !== null);
};

type TeamLineupStrengthProps = {
  starters: RosterPlayer[];
};

export const TeamLineupStrength = ({ starters }: TeamLineupStrengthProps) => {
  const tiles = getTiles(starters);

  if (tiles.length === 0) return null;

  return (
    <div className={'flex flex-col gap-2 rounded-lg border p-3'}>
      <h3 className={'font-display font-bold text-sm uppercase tracking-wide'}>
        Força titular
      </h3>
      <div className={'flex flex-col gap-3'}>
        {tiles.map((tile) => (
          <div key={tile.group} className={'flex flex-col gap-1'}>
            <div className={'flex items-center justify-between gap-2'}>
              <span
                className={
                  'font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
                }
              >
                {getPositionGroupLabel(tile.group)}
              </span>
              <span className={'font-display font-bold text-sm'}>
                {Math.round(tile.average)}
              </span>
            </div>
            <Progress
              value={tile.average}
              max={99}
              indicatorClassName={getOverallRatingIndicatorClassName(
                tile.average,
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
