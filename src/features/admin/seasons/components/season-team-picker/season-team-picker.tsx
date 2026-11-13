import { PaginationWrapper, SearchInput } from '@/components';
import type { TeamWithRatings } from '@/features/admin/teams';
import { useSeasonTeamPicker } from '../../hooks';
import { SeasonTeamPickerTeams } from '../season-team-picker-teams';
import { SeasonTeamPickerEmptyMessage } from './season-team-picker-empty-message';
import { SeasonTeamPickerLoading } from './season-team-picker-loading';

type SeasonTeamPickerProps = {
  excludeTeamIds: Set<string>;
  onSelect: (team: TeamWithRatings) => void;
};

export const SeasonTeamPicker = ({
  excludeTeamIds,
  onSelect,
}: SeasonTeamPickerProps) => {
  const {
    draftName,
    setTeamFilter,
    data,
    page,
    handleNextPage,
    handlePreviousPage,
    isPending,
    teams,
  } = useSeasonTeamPicker();

  return (
    <div className={'flex flex-col gap-2 rounded-xl border bg-muted/30 p-2'}>
      <SearchInput
        value={draftName}
        onChange={(value) =>
          setTeamFilter({
            draftName: value,
            page: 1,
          })
        }
        placeholder={'Buscar time...'}
        className={'max-w-full'}
      />

      <div
        className={
          'grid max-h-56 grid-cols-1 gap-1.5 overflow-y-auto sm:grid-cols-2'
        }
      >
        {isPending && <SeasonTeamPickerLoading />}
        {!isPending && teams.length === 0 && <SeasonTeamPickerEmptyMessage />}

        {!isPending &&
          teams.map((team) => (
            <SeasonTeamPickerTeams
              key={team.id}
              excludeTeamIds={excludeTeamIds}
              pickTeam={onSelect}
              team={team}
            />
          ))}
      </div>

      {data && data.totalPages > 1 && (
        <PaginationWrapper
          page={page}
          totalPages={data.totalPages}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
        />
      )}
    </div>
  );
};
