import { Switch } from '@/components/ui';
import type { Season } from '../api';
import { useSeasonSelection } from '../hooks';

type SeasonSelectCellProps = {
  season: Season;
  isSelected: boolean;
};

export const SeasonSelectCell = ({
  season,
  isSelected,
}: SeasonSelectCellProps) => {
  const { selectSeasonId } = useSeasonSelection();

  return (
    <Switch
      checked={isSelected}
      onCheckedChange={(checked) => checked && selectSeasonId(season.id)}
      aria-label={`Selecionar temporada ${season.name}`}
    />
  );
};
