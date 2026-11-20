import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Badge, DataTable } from '@/components/ui';
import { formatDateTime } from '@/lib';
import type { NegotiationWindow } from '../types';

type NegotiationWindowHistoryTableProps = {
  history: NegotiationWindow[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
};

const columns: ColumnDef<NegotiationWindow>[] = [
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.closedAt ? 'outline' : 'secondary'}>
        {row.original.closedAt ? 'Fechada' : 'Aberta'}
      </Badge>
    ),
  },
  {
    id: 'feeEnabled',
    header: 'Taxa',
    cell: ({ row }) => (row.original.feeEnabled ? 'Ativada' : 'Desativada'),
  },
  {
    id: 'opened',
    header: 'Aberta em',
    cell: ({ row }) =>
      `${formatDateTime(row.original.openedAt)} por ${row.original.openedBy.name}`,
  },
  {
    id: 'closed',
    header: 'Fechada em',
    cell: ({ row }) =>
      row.original.closedAt
        ? `${formatDateTime(row.original.closedAt)} por ${row.original.closedBy?.name}`
        : '—',
  },
];

export const NegotiationWindowHistoryTable = ({
  history,
  isPending,
  isError,
  error,
}: NegotiationWindowHistoryTableProps) => {
  const table = useReactTable({
    data: history,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTable
      table={table}
      isPending={isPending}
      isError={isError}
      error={error}
      errorMessage={'Não foi possível carregar o histórico da janela.'}
      emptyMessage={'Nenhuma janela de negociação aberta ainda.'}
      skeletonRowCount={3}
    />
  );
};
