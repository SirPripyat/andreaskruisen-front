import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ListFilterIcon } from 'lucide-react';
import {
  OverallRatingBadge,
  PageHeader,
  SearchInput,
  TeamCell,
} from '@/components';
import {
  Button,
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import type { TeamWithRatings } from './api';
import { TeamRowActions } from './components';
import { useLeagues, useTeamsScreen } from './hooks';

const PAGE_SIZE = 10;

const ALL_LEAGUES = 'all';

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
    draftName,
    setDraftName,
    withoutFormation,
    toggleWithoutFormation,
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
          'Times e ligas monitorados, com médias de avaliação por linha do elenco.'
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
        <Button
          variant={withoutFormation ? 'default' : 'outline'}
          onClick={toggleWithoutFormation}
        >
          <ListFilterIcon />
          Sem formação
        </Button>
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
