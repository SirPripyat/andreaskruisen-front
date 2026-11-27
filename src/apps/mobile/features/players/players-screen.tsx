import { PageHeader, SearchInput } from '@/components';
import { Skeleton } from '@/components/ui';
import { formatNumber } from '@/lib';
import {
  ActiveFilterChips,
  InfiniteScrollSentinel,
  PlayerCard,
  PlayersFilterSheet,
} from './components';
import { useMobilePlayersScreen } from './hooks';

const SKELETON_COUNT = 6;

export const PlayersScreen = () => {
  const {
    players,
    total,
    draftName,
    setDraftName,
    advancedFilters,
    activeAdvancedFilterCount,
    applyAdvancedFilters,
    clearAdvancedFilters,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMobilePlayersScreen();

  return (
    <>
      <PageHeader
        title={'Jogadores'}
        description={'Elenco de jogadores da temporada atual.'}
      />

      <div className={'flex flex-col gap-3'}>
        <div className={'flex items-center gap-2'}>
          <SearchInput
            value={draftName}
            onChange={setDraftName}
            placeholder={'Buscar jogador...'}
            className={'max-w-none flex-1'}
          />
          <PlayersFilterSheet
            filters={advancedFilters}
            activeFilterCount={activeAdvancedFilterCount}
            onApply={applyAdvancedFilters}
            onClear={clearAdvancedFilters}
          />
        </div>

        <ActiveFilterChips
          filters={advancedFilters}
          onApply={applyAdvancedFilters}
        />

        {total !== undefined && (
          <span className={'text-muted-foreground text-xs'}>
            {formatNumber(total)} jogador
            {total === 1 ? '' : 'es'}
          </span>
        )}
      </div>

      {isError && (
        <p className={'text-destructive text-sm'}>
          Não foi possível carregar os jogadores.
        </p>
      )}

      {isPending ? (
        <div className={'flex flex-col gap-2'}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size placeholder list, order never changes
              key={index}
              className={'h-24 w-full'}
            />
          ))}
        </div>
      ) : players.length === 0 ? (
        <p className={'text-muted-foreground text-sm'}>
          Nenhum jogador encontrado.
        </p>
      ) : (
        <div className={'flex flex-col gap-2'}>
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}

          {isFetchingNextPage && <Skeleton className={'h-24 w-full'} />}

          <InfiniteScrollSentinel
            onIntersect={fetchNextPage}
            disabled={!hasNextPage || isFetchingNextPage}
          />
        </div>
      )}
    </>
  );
};
