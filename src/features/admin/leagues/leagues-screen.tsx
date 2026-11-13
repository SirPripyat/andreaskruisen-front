import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  PageHeader,
  SearchInput,
} from '@/components';
import { NationalityCell } from '@/features/admin/players';
import { formatNumber } from '@/lib';
import { LeagueCell, LeagueRowActions } from './components';
import { useLeaguesScreen } from './hooks';
import type { LeagueWithCountry } from './types';

const PAGE_SIZE = 10;

const columns: ColumnDef<LeagueWithCountry>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Liga</DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <LeagueCell logoUrl={row.original.logoUrl} name={row.original.name} />
    ),
  },
  {
    id: 'country',
    header: 'País',
    cell: ({ row }) =>
      row.original.country ? (
        <NationalityCell
          flagUrl={row.original.country.flagUrl}
          name={row.original.country.name}
        />
      ) : (
        <span className={'text-muted-foreground'}>—</span>
      ),
  },
  {
    id: 'actions',
    header: '',
    meta: { className: 'text-right' },
    cell: ({ row }) => <LeagueRowActions league={row.original} />,
  },
];

export const LeaguesScreen = () => {
  const {
    leagues,
    sorting,
    onSortingChange,
    setFilters,
    draftName,
    setDraftName,
    isPending,
    isError,
    error,
    data,
  } = useLeaguesScreen();

  const table = useReactTable({
    data: leagues,
    columns,
    getRowId: (league) => league.id,
    state: { sorting },
    enableSortingRemoval: false,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader
        title={'Ligas'}
        description={'Ligas disponíveis para times e jogadores.'}
      />

      <div className={'flex flex-wrap items-center gap-2'}>
        <SearchInput
          value={draftName}
          onChange={setDraftName}
          placeholder={'Buscar liga...'}
          className={'w-full sm:w-auto'}
        />
        {data && (
          <span className={'text-muted-foreground text-sm'}>
            {formatNumber(data.total)} liga
            {data.total === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <DataTable
        table={table}
        isPending={isPending}
        isError={isError}
        error={error}
        errorMessage={'Não foi possível carregar as ligas.'}
        emptyMessage={'Nenhuma liga encontrada.'}
        skeletonRowCount={PAGE_SIZE}
      />

      {data && (
        <DataTablePagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={(nextPage) => setFilters({ page: nextPage })}
        />
      )}
    </>
  );
};
