import { Switch } from '@/components/ui';
import { useSelectSeason } from '../hooks';
import type { Season } from '../types';

type SeasonSelectCellProps = {
  season: Season;
  isSelected: boolean;
};

export const SeasonSelectCell = ({
  season,
  isSelected,
}: SeasonSelectCellProps) => {
  const { mutate: selectSeason } = useSelectSeason();

  const selectSeasonId = (seasonId: string) => selectSeason(seasonId);

  return (
    <Switch
      checked={isSelected}
      onCheckedChange={(checked) => checked && selectSeasonId(season.id)}
      aria-label={`Selecionar temporada ${season.name}`}
    />
  );
};
