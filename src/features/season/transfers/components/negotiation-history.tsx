import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowRightIcon, CoinsIcon } from 'lucide-react';
import { Badge, DataTable } from '@/components';
import { formatDateTime, formatNumber } from '@/lib';
import { useTransfers } from '../hooks';
import type { Transfer } from '../types';
import { PlayerCell } from './player-cell';
import { TeamCell } from './team-cell';
import { TransferOriginBadge } from './transfer-origin-badge';

const columns: ColumnDef<Transfer>[] = [
  {
    id: 'origin',
    header: 'Origem',
    cell: ({ row }) => (
      <TransferOriginBadge originType={row.original.originType} />
    ),
  },
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
    accessorKey: 'cost',
    header: 'Custo',
    cell: ({ row }) => (
      <Badge variant={'secondary'} className={'gap-1.5'}>
        <CoinsIcon className={'size-3.5'} />
        {`${formatNumber(row.original.cost)} coins`}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => formatDateTime(row.original.date),
  },
];

export const NegotiationHistory = () => {
  const { data: transfers, isPending, isError, error } = useTransfers();

  const table = useReactTable({
    data: transfers ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTable
      table={table}
      isPending={isPending}
      isError={isError}
      error={error}
      errorMessage={'Não foi possível carregar as transferências.'}
      emptyMessage={'Nenhuma transferência registrada ainda.'}
      skeletonRowCount={3}
    />
  );
};
