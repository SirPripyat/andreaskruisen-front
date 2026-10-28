import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  OverallRatingBadge,
  PageHeader,
  SearchInput,
  TeamCell,
} from '@/components';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
} from '@/components/ui';
import type { TeamWithRatings } from './api';
import { useTeamsScreen } from './hooks';

const PAGE_SIZE = 10;

const numberFormatter = new Intl.NumberFormat('pt-BR');

const columns: ColumnDef<TeamWithRatings>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Equipe</DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <TeamCell
        crestUrl={row.original.crestUrl}
        name={row.original.name}
        size={'lg'}
      />
    ),
  },
  {
    id: 'league',
    header: 'Liga',
    cell: ({ row }) => row.original.league.name,
  },
  {
    id: 'averageOverallRating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Overall</DataTableColumnHeader>
    ),
    sortDescFirst: true,
    accessorFn: (row) => row.averageOverallRating,
    cell: ({ row }) => (
      <OverallRatingBadge rating={row.original.averageOverallRating} />
    ),
  },
  {
    id: 'averageAttackRating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Ataque</DataTableColumnHeader>
    ),
    sortDescFirst: true,
    accessorFn: (row) => row.averageAttackRating,
    cell: ({ row }) => (
      <OverallRatingBadge rating={row.original.averageAttackRating} />
    ),
  },
  {
    id: 'averageMidfieldRating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Meio-campo</DataTableColumnHeader>
    ),
    sortDescFirst: true,
    accessorFn: (row) => row.averageMidfieldRating,
    cell: ({ row }) => (
      <OverallRatingBadge rating={row.original.averageMidfieldRating} />
    ),
  },
  {
    id: 'averageDefenseRating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Defesa</DataTableColumnHeader>
    ),
    sortDescFirst: true,
    accessorFn: (row) => row.averageDefenseRating,
    cell: ({ row }) => (
      <OverallRatingBadge rating={row.original.averageDefenseRating} />
    ),
  },
];

export const TeamsScreen = () => {
  const {
    teams,
    sorting,
    onSortingChange,
    setFilters,
    draftName,
    setDraftName,
    isPending,
    isError,
    error,
    data,
  } = useTeamsScreen();

  const table = useReactTable({
    data: teams,
    columns,
    state: { sorting },
    enableSortingRemoval: false,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader
        title={'Times'}
        description={
          'Times e ligas monitorados, com médias de avaliação por linha do elenco.'
        }
      />

      <div className={'flex items-center gap-2'}>
        <SearchInput
          value={draftName}
          onChange={setDraftName}
          placeholder={'Buscar time...'}
        />
        {data && (
          <span className={'text-muted-foreground text-sm'}>
            {numberFormatter.format(data.total)} time
            {data.total === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <DataTable
        table={table}
        isPending={isPending}
        isError={isError}
        error={error}
        errorMessage={'Não foi possível carregar os times.'}
        emptyMessage={'Nenhum time encontrado.'}
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
