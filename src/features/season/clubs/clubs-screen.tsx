import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  type TeamWithRatings,
  useLeagues,
  useTeamsScreen,
} from '@/features/admin/teams';
import { ActionsCell } from './components';

const PAGE_SIZE = 10;

const ALL_LEAGUES = 'all';

const columns: ColumnDef<TeamWithRatings>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Equipe</DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <Link to={`/teams/${row.original.id}`} className={'hover:underline'}>
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
    id: 'actions',
    header: '',
    cell: ({ row }) => <ActionsCell id={row.original.id} />,
  },
];

export const ClubsScreen = () => {
  const {
    teams,
    sorting,
    onSortingChange,
    setFilters,
    draftName,
    setDraftName,
    leagueId,
    setLeagueId,
    isPending,
    isError,
    error,
    data,
  } = useTeamsScreen();

  const { data: leagues } = useLeagues();

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
          'Todos os times monitorados. Selecione um time para ver os detalhes.'
        }
      />

      <div className={'flex flex-wrap items-center gap-2'}>
        <SearchInput
          value={draftName}
          onChange={setDraftName}
          placeholder={'Buscar time...'}
          className={'w-full sm:w-auto'}
        />
        <Select
          value={leagueId || ALL_LEAGUES}
          onValueChange={(value) =>
            setLeagueId(value === ALL_LEAGUES ? '' : (value as string))
          }
          items={{
            [ALL_LEAGUES]: 'Todas as ligas',
            ...Object.fromEntries(
              (leagues ?? []).map((league) => [league.id, league.name]),
            ),
          }}
        >
          <SelectTrigger className={'w-auto min-w-44 shrink-0'}>
            <SelectValue className={'whitespace-nowrap'} />
          </SelectTrigger>

          <SelectContent className={'max-h-64'} alignItemWithTrigger={false}>
            <SelectItem value={ALL_LEAGUES}>Todas as ligas</SelectItem>

            {leagues?.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                {league.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
