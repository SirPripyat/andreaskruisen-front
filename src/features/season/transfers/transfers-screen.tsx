import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowRightIcon } from 'lucide-react';
import { PageHeader } from '@/components';
import { DataTable } from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';
import { formatDateTime } from '@/lib';
import { CreateTransferDrawer, PlayerCell, TeamCell } from './components';
import { useTransfers } from './hooks';
import type { Transfer } from './types';

const columns: ColumnDef<Transfer>[] = [
  {
    id: 'player',
    header: 'Jogador',
    cell: ({ row }) => <PlayerCell player={row.original.player} />,
  },
  {
    id: 'fromTeam',
    header: 'Saiu de',
    cell: ({ row }) => <TeamCell team={row.original.fromTeam} />,
  },
  {
    id: 'arrow',
    header: '',
    cell: () => <ArrowRightIcon className={'size-4 text-muted-foreground'} />,
  },
  {
    id: 'toTeam',
    header: 'Foi para',
    cell: ({ row }) => <TeamCell team={row.original.toTeam} />,
  },
  {
    id: 'requestedBy',
    header: 'Solicitado por',
    cell: ({ row }) => row.original.requestedBy.name,
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => formatDateTime(row.original.date),
  },
];

export const TransfersScreen = () => {
  const { selectedSeason, isPending: isSeasonPending } = useSelectedSeason();
  const { data: transfers, isPending, isError, error } = useTransfers();

  const isLoading = isSeasonPending || isPending;

  const table = useReactTable({
    data: transfers ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader
        title={'Transferências'}
        description={`Trocas de jogadores realizadas na temporada "${selectedSeason?.name}".`}
        actions={<CreateTransferDrawer seasonId={selectedSeason?.id} />}
      />

      <DataTable
        table={table}
        isPending={isLoading}
        isError={isError}
        error={error}
        errorMessage={'Não foi possível carregar as transferências.'}
        emptyMessage={'Nenhuma transferência registrada ainda.'}
        skeletonRowCount={3}
      />
    </>
  );
};
