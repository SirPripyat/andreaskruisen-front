import { PageHeader, SearchInput } from '@/components';
import { Skeleton } from '@/components/ui';
import { formatNumber } from '@/lib';
import {
  ClubCard,
  ClubsFilterSheet,
  InfiniteScrollSentinel,
} from './components';
import { useMobileClubsScreen } from './hooks';

const SKELETON_COUNT = 6;

export const ClubsScreen = () => {
  const {
    clubs,
    total,
    draftName,
    setDraftName,
    leagueId,
    leagues,
    sortBy,
    sortOrder,
    activeFilterCount,
    applyFilters,
    clearFilters,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMobileClubsScreen();

  return (
    <>
      <PageHeader
        title={'Times'}
        description={
          'Todos os times monitorados. Selecione um time para ver os detalhes.'
        }
      />

      <div className={'flex flex-col gap-3'}>
        <div className={'flex items-center gap-2'}>
          <SearchInput
            value={draftName}
            onChange={setDraftName}
            placeholder={'Buscar time...'}
            className={'max-w-none flex-1'}
          />
          <ClubsFilterSheet
            leagueId={leagueId}
            leagues={leagues}
            sortBy={sortBy}
            sortOrder={sortOrder}
            activeFilterCount={activeFilterCount}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </div>

        {total !== undefined && (
          <span className={'text-muted-foreground text-xs'}>
            {formatNumber(total)} time
            {total === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {isError && (
        <p className={'text-destructive text-sm'}>
          Não foi possível carregar os times.
        </p>
      )}

      {isPending ? (
        <div className={'flex flex-col gap-2'}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size placeholder list, order never changes
              key={index}
              className={'h-32 w-full'}
            />
          ))}
        </div>
      ) : clubs.length === 0 ? (
        <p className={'text-muted-foreground text-sm'}>
          Nenhum time encontrado.
        </p>
      ) : (
        <div className={'flex flex-col gap-4'}>
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}

          {isFetchingNextPage && <Skeleton className={'h-32 w-full'} />}

          <InfiniteScrollSentinel
            onIntersect={fetchNextPage}
            disabled={!hasNextPage || isFetchingNextPage}
          />
        </div>
      )}
    </>
  );
};
