import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  OverallRatingBadge,
  PageHeader,
  TeamCell,
} from '@/components';
import { LeagueCell } from '@/features/admin/leagues';
import { ActionsCell, ClubsDataFilters } from './components';
import { useClubsScreen } from './hooks';
import type { ClubWithRatings } from './types';

const PAGE_SIZE = 10;

const columns: ColumnDef<ClubWithRatings>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Equipe</DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <Link to={`/clubs/${row.original.id}`} className={'hover:underline'}>
        <TeamCell
          crestUrl={row.original.crestUrl}
          name={row.original.name}
          size={'lg'}
        />
      </Link>
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
    id: 'actions',
    header: '',
    cell: ({ row }) => <ActionsCell id={row.original.id} />,
  },
];

export const ClubsScreen = () => {
  const {
    clubs,
    sorting,
    onSortingChange,
    setFilters,
    isPending,
    isError,
    error,
    data,
  } = useClubsScreen();

  const table = useReactTable({
    data: clubs,
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
          'Todos os times monitorados. Selecione um time para ver os detalhes.'
        }
      />

      <ClubsDataFilters data={data} />

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
