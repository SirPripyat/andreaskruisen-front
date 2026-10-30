import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { UploadIcon } from 'lucide-react';
import { Link } from 'react-router';
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
} from '@/components/ui';
import { calculateAge } from '@/lib';
import type { PlayerListItem } from './api';
import {
  AvatarPlayer,
  NationalityCell,
  PlayerPositionCell,
} from './components';
import { usePlayersScreen } from './hooks';

const PAGE_SIZE = 10;

const numberFormatter = new Intl.NumberFormat('pt-BR');

const PREFERRED_FOOT_LABELS: Record<string, string> = {
  LEFT: 'Canhoto',
  RIGHT: 'Destro',
  BOTH: 'Ambidestro',
};

const columns: ColumnDef<PlayerListItem>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Jogador</DataTableColumnHeader>
    ),
    cell: ({ row }) => <AvatarPlayer {...row.original} />,
  },
  {
    id: 'positions',
    header: 'Posições',
    cell: ({ row }) => (
      <PlayerPositionCell positions={row.original.positions} />
    ),
  },
  {
    id: 'team',
    header: 'Equipe',
    cell: ({ row }) => (
      <TeamCell
        name={row.original.team.name}
        crestUrl={row.original.team.crestUrl}
      />
    ),
  },
  {
    id: 'nationality',
    header: 'Nacionalidade',
    cell: ({ row }) => (
      <NationalityCell
        flagUrl={row.original.nationality.flagUrl}
        name={row.original.nationality.name}
      />
    ),
  },
  {
    id: 'foot',
    header: 'Pé preferido',
    cell: ({ row }) => PREFERRED_FOOT_LABELS[row.original.preferredFoot],
  },
  {
    id: 'overallRating',
    accessorFn: (row) => row.latestRating?.overallRating,
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Overall</DataTableColumnHeader>
    ),
    sortDescFirst: true,
    cell: ({ row }) => (
      <OverallRatingBadge
        rating={row.original.latestRating?.overallRating ?? null}
      />
    ),
  },
  {
    id: 'age',
    header: 'Idade',
    cell: ({ row }) => calculateAge(row.original.birthdate),
  },
];

export const PlayersScreen = () => {
  const {
    players,
    sorting,
    onSortingChange,
    setFilters,
    draftName,
    setDraftName,
    isPending,
    isError,
    error,
    data,
  } = usePlayersScreen();

  const table = useReactTable({
    data: players,
    columns,
    state: { sorting },
    enableSortingRemoval: false,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader
        title={'Jogadores'}
        description={
          'Base de jogadores extraída do scraper, com posições, nacionalidade e avaliações.'
        }
        actions={
          <Button variant={'default'} render={<Link to={'/players/import'} />}>
            <UploadIcon />
            Importar
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <SearchInput
          value={draftName}
          onChange={setDraftName}
          placeholder="Buscar jogador..."
        />
        {data && (
          <span className="text-muted-foreground text-xs">
            {numberFormatter.format(data.total)} jogador
            {data.total === 1 ? '' : 'es'}
          </span>
        )}
      </div>

      <DataTable
        table={table}
        isPending={isPending}
        isError={isError}
        error={error}
        errorMessage="Não foi possível carregar os jogadores."
        emptyMessage="Nenhum jogador encontrado."
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
