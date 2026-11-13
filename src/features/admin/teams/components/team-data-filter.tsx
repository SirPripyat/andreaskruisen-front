import {
  Button,
  SearchInput,
  SelectOptions,
  toSelectOptions,
} from '@/components';
import { LeagueCell } from '@/features/admin/leagues';
import { formatNumber, type PaginatedResult } from '@/lib';
import { ALL_LEAGUES } from '../constants';
import { useTeamDataFilter } from '../hooks';
import type { TeamWithRatings } from '../types';

type TeamDataFilterProps = {
  data?: PaginatedResult<TeamWithRatings>;
};

export const TeamDataFilter = ({ data }: TeamDataFilterProps) => {
  const {
    filters,
    setLeagueId,
    draftName,
    setDraftName,
    leagues,
    hasActiveFilters,
    clearFilters,
  } = useTeamDataFilter();

  return (
    <div className={'flex flex-wrap items-center gap-2'}>
      <SearchInput
        value={draftName}
        onChange={setDraftName}
        placeholder={'Buscar time...'}
        className={'w-full sm:w-auto'}
      />

      <SelectOptions
        value={filters.leagueId || ALL_LEAGUES}
        onValueChange={(value) => setLeagueId(value)}
        options={toSelectOptions(
          { value: ALL_LEAGUES, label: 'Todas as ligas' },
          leagues,
          (league) => ({
            value: league.id,
            label: <LeagueCell logoUrl={league.logoUrl} name={league.name} />,
          }),
        )}
        triggerClassName={'w-auto min-w-44 shrink-0'}
        contentClassName={'max-h-64'}
        alignItemWithTrigger={false}
      />

      {hasActiveFilters && (
        <Button variant={'ghost'} onClick={clearFilters}>
          Limpar filtro
        </Button>
      )}

      {data && (
        <span className={'text-muted-foreground text-sm ml-8'}>
          {formatNumber(data.total)} time
          {data.total === 1 ? '' : 's'}
        </span>
      )}
    </div>
  );
};
