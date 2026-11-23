import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router';
import { PageHeader } from '@/components';
import { Badge, DataTable } from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';
import { formatDate } from '@/lib';
import {
  CreateTournamentDrawer,
  TeamChip,
  TournamentActionsMenu,
  TournamentFormatIcon,
} from './components';
import { useTournaments } from './hooks';
import { TOURNAMENT_FORMAT_LABELS, type Tournament } from './types';

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
    meta: { className: 'hidden sm:table-cell' },
    cell: ({ row }) => (
      <Badge variant="outline" className={'gap-1.5'}>
        <TournamentFormatIcon
          format={row.original.format}
          className={'size-3.5'}
        />
        {TOURNAMENT_FORMAT_LABELS[row.original.format]}
      </Badge>
    ),
  },
  {
    accessorKey: 'maxTeams',
    header: 'Times',
    meta: { className: 'hidden sm:table-cell' },
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { finishedAt, currentPhase } = row.original;

      if (finishedAt) return <Badge variant="secondary">Encerrado</Badge>;
      if (currentPhase)
        return (
          <Badge className="border-transparent bg-accent-surface text-accent">
            {currentPhase.name}
          </Badge>
        );
      return <Badge variant="outline">Não iniciado</Badge>;
    },
  },
  {
    id: 'champion',
    header: 'Campeão',
    meta: { className: 'hidden md:table-cell' },
    cell: ({ row }) => {
      const { champion } = row.original;

      if (!champion) return null;

      return (
        <TeamChip
          teamId={champion.id}
          name={champion.name}
          crestUrl={champion.crestUrl}
          owner={champion.owner}
        />
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    meta: { className: 'hidden md:table-cell' },
    cell: ({ row }) => formatDate(row.original.createdAt),
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
