import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { PageHeader, SearchInput } from '@/components';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
} from '@/components/ui';
import { formatNumber } from '@/lib';
import { NationalityFlagCell, NationalityRowActions } from './components';
import { useNationalitiesScreen } from './hooks';
import type { Nationality } from './types';

const PAGE_SIZE = 10;

const columns: ColumnDef<Nationality>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Nome</DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <NationalityFlagCell
        flagUrl={row.original.flagUrl}
        name={row.original.name}
      />
    ),
  },
  {
    id: 'actions',
    header: '',
    meta: { className: 'text-right' },
    cell: ({ row }) => <NationalityRowActions nationality={row.original} />,
  },
];

export const NationalitiesScreen = () => {
  const {
    nationalities,
    sorting,
    onSortingChange,
    setFilters,
    draftName,
    setDraftName,
    isPending,
    isError,
    error,
    data,
  } = useNationalitiesScreen();

  const table = useReactTable({
    data: nationalities,
    columns,
    state: { sorting },
    enableSortingRemoval: false,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader
        title={'Nacionalidades'}
        description={
          'Nacionalidades disponíveis para jogadores, com nome e bandeira.'
        }
      />

      <div className={'flex flex-wrap items-center gap-2'}>
        <SearchInput
          value={draftName}
          onChange={setDraftName}
          placeholder={'Buscar nacionalidade...'}
          className={'w-full sm:w-auto'}
        />
        {data && (
          <span className={'text-muted-foreground text-sm'}>
            {formatNumber(data.total)} nacionalidade
            {data.total === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <DataTable
        table={table}
        isPending={isPending}
        isError={isError}
        error={error}
        errorMessage={'Não foi possível carregar as nacionalidades.'}
        emptyMessage={'Nenhuma nacionalidade encontrada.'}
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
