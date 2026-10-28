import { SearchInput } from '@/components';
import { Skeleton } from '@/components/ui';
import type { TeamWithRatings } from '@/features/teams';
import { useSeasonTeamPicker } from '../hooks';
import { SeasonTeamPickerPagination } from './season-team-picker-pagination';
import { SeasonTeamPickerTeams } from './season-team-picker-teams';

type SeasonTeamPickerProps = {
  excludeTeamIds: Set<string>;
  onSelect: (team: TeamWithRatings) => void;
};

const PAGE_SIZE = 6;

const SKELETON_ROW_KEYS = Array.from(
  { length: PAGE_SIZE },
  (_, index) => `skeleton-squad-team-${index}`,
);

const SeasonTeamPickerLoading = () => (
  <>
    {SKELETON_ROW_KEYS.map((item) => (
      <div
        key={item}
        className={
          'flex items-center gap-2 rounded-lg border bg-background p-2'
        }
      >
        <Skeleton className={'size-6 shrink-0 rounded-full'} />
        <Skeleton className={'h-4 w-full max-w-28'} />
      </div>
    ))}
  </>
);

const SeasonTeamPickerEmptyMessage = () => (
  <div
    className={
      'col-span-full flex h-20 items-center justify-center text-muted-foreground text-sm'
    }
  >
    Nenhum time encontrado.
  </div>
);

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
        <SeasonTeamPickerPagination
          page={page}
          totalPages={data.totalPages}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
        />
      )}
    </div>
  );
};
