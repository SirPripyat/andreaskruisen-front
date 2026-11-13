import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router';
import { OverallRatingBadge, PageHeader, TeamCell } from '@/components';
import { DataTable } from '@/components/ui';
import { AvatarPlayer, NationalityCell } from '@/features/admin/players';
import { formatNumber } from '@/lib';
import { FavoritesRowActions } from './components';
import { useFavorites } from './hooks';
import type { FavoritePlayer } from './types';

const PAGE_SIZE = 10;

const columns: ColumnDef<FavoritePlayer>[] = [
  {
    accessorKey: 'name',
    header: 'Jogador',
    cell: ({ row }) => (
      <Link to={`/players/${row.original.id}`} className={'hover:underline'}>
        <AvatarPlayer
          photoUrl={row.original.photoUrl}
          name={row.original.name}
        />
      </Link>
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
    id: 'overallRating',
    header: 'Overall',
    cell: ({ row }) => (
      <OverallRatingBadge rating={row.original.latestOverallRating} />
    ),
  },
  {
    id: 'actions',
    header: '',
    meta: { className: 'text-right' },
    cell: ({ row }) => (
      <FavoritesRowActions
        playerId={row.original.id}
        teamId={row.original.team.id}
      />
    ),
  },
];

export const FavoritesScreen = () => {
  const { data: favorites, isPending, isError, error } = useFavorites();

  const table = useReactTable({
    data: favorites ?? [],
    columns,
    getRowId: (player) => player.id,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader
        title={'Favoritos'}
        description={'Jogadores marcados como favoritos nesta temporada.'}
      />

      {favorites && (
        <span className={'text-muted-foreground text-sm'}>
          {formatNumber(favorites.length)} jogador
          {favorites.length === 1 ? '' : 'es'}
        </span>
      )}

      <DataTable
        table={table}
        isPending={isPending}
        isError={isError}
        error={error}
        errorMessage={'Não foi possível carregar os favoritos.'}
        emptyMessage={'Nenhum jogador favoritado ainda.'}
        skeletonRowCount={PAGE_SIZE}
      />
    </>
  );
};
