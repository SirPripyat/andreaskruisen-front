import { Switch } from '@/components/ui';
import type { Season } from '../api';
import { useSelectSeason } from '../hooks';

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
