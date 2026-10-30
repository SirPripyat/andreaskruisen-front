import { cn } from 'cn';
import { Badge } from '@/components/ui';
import type { PlayerPosition } from '../api';

const getPositionGroupClassName = (position: string) => {
  if (/GOALKEEPER|^GOL$/.test(position))
    return 'bg-warning-surface text-warning';
  if (/BACK|DEFENDER|^(ZAG|LE|LD|ADE|ADD)$/.test(position))
    return 'bg-info-surface text-info';
  if (/MID|^(VOL|MC|MEI|ME|MD|MAE|MAD)$/.test(position))
    return 'bg-success-surface text-success';
  if (/WING|STRIKER|FORWARD|^(PE|PD|ATA)$/.test(position))
    return 'bg-accent-surface text-accent';

  return '';
};

type PlayerPositionCellProps = {
  positions: PlayerPosition[];
};

export const PlayerPositionCell = ({ positions }: PlayerPositionCellProps) => {
  return (
    <div className="flex flex-wrap gap-1">
      {positions.map(({ position }) => (
        <Badge
          key={position}
          variant="outline"
          className={cn(
            'border-transparent',
            getPositionGroupClassName(position),
          )}
        >
          {position}
        </Badge>
      ))}
    </div>
  );
};
