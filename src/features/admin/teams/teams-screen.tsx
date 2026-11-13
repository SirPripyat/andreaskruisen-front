import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  OverallRatingBadge,
  PageHeader,
  TeamCell,
} from '@/components';
import { LeagueCell } from '@/features/admin/leagues';
import { TeamDataFilter, TeamRowActions } from './components';
import { useTeamsScreen } from './hooks';
import type { TeamWithRatings } from './types';

const PAGE_SIZE = 10;

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
    cell: ({ row }) => (
      <LeagueCell
        logoUrl={row.original.league.logoUrl}
        name={row.original.league.name}
      />
    ),
  },
  {
    id: 'formation',
    header: 'Formação',
    cell: ({ row }) => (
      <span
        className={
          row.original.formation === null ? 'text-muted-foreground' : ''
        }
      >
        {row.original.formation ?? 'Sem formação'}
      </span>
    ),
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
  {
    id: 'actions',
    header: '',
    meta: { className: 'text-right' },
    cell: ({ row }) => <TeamRowActions team={row.original} />,
  },
];

export const TeamsScreen = () => {
  const {
    teams,
    sorting,
    onSortingChange,
    setFilters,
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

      <TeamDataFilter data={data} />

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
