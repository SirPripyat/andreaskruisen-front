import { Badge } from '@/components/ui';
import { cn, getPositionGroupClassName } from '@/lib';
import type { PlayerPosition } from '../types';

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
