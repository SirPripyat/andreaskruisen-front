import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router';
import { PageHeader } from '@/components';
import { Badge, DataTable } from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';
import { TOURNAMENT_FORMAT_LABELS, type Tournament } from './api';
import { CreateTournamentDrawer, TournamentActionsMenu } from './components';
import { useTournaments } from './hooks';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
});

const columns: ColumnDef<Tournament>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => (
      <Link
        to={`/tournaments/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'format',
    header: 'Formato',
    cell: ({ row }) => (
      <Badge variant="outline">
        {TOURNAMENT_FORMAT_LABELS[row.original.format]}
      </Badge>
    ),
  },
  {
    accessorKey: 'maxTeams',
    header: 'Times',
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    cell: ({ row }) => dateFormatter.format(new Date(row.original.createdAt)),
  },
  {
    id: 'actions',
    header: '',
    meta: { className: 'text-right' },
    cell: ({ row }) => <TournamentActionsMenu tournament={row.original} />,
  },
];

export const TournamentsScreen = () => {
  const { selectedSeason, isPending: isSeasonPending } = useSelectedSeason();
  const { data: tournaments, isPending, isError, error } = useTournaments();

  const isLoading = isSeasonPending || isPending;

  const table = useReactTable({
    data: tournaments ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader
        title="Torneios"
        description={`Torneios disputados na temporada "${selectedSeason?.name}".`}
        actions={
          <CreateTournamentDrawer
            seasonId={selectedSeason?.id}
            seasonName={selectedSeason?.name}
          />
        }
      />

      <DataTable
        table={table}
        isPending={isLoading}
        isError={isError}
        error={error}
        errorMessage="Não foi possível carregar os torneios."
        emptyMessage="Nenhum torneio criado ainda."
        skeletonRowCount={3}
      />
    </>
  );
};
