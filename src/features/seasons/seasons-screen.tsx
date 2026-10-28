import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { PageHeader } from '@/components';
import { DataTable, Switch } from '@/components/ui';
import type { Season } from './api';
import { CreateSeasonDrawer, SeasonActionsMenu } from './components';
import { useSeasonSelection } from './hooks';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
});

export function SeasonsScreen() {
  const { seasons, selectedSeason, isPending, selectSeasonId } =
    useSeasonSelection();

  const columns: ColumnDef<Season>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'startedAt',
      header: 'Iniciada em',
      cell: ({ row }) => dateFormatter.format(new Date(row.original.startedAt)),
    },
    {
      id: 'selected',
      header: 'Selecionada',
      meta: { className: 'text-right' },
      cell: ({ row }) => {
        const season = row.original;
        const isSelected = season.id === selectedSeason?.id;
        return (
          <Switch
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                selectSeasonId(season.id);
              }
            }}
            aria-label={`Selecionar temporada ${season.name}`}
          />
        );
      },
    },
    {
      id: 'actions',
      header: '',
      meta: { className: 'text-right' },
      cell: ({ row }) => <SeasonActionsMenu season={row.original} />,
    },
  ];

  const table = useReactTable({
    data: seasons,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <PageHeader
        title="Temporadas"
        description="Uma temporada isola as negociações entre clubes sem afetar a base original de times e jogadores. Os torneios disputados ficam vinculados à temporada em que foram criados."
        actions={<CreateSeasonDrawer />}
      />

      <DataTable
        table={table}
        isPending={isPending}
        emptyMessage="Nenhuma temporada criada ainda."
        skeletonRowCount={3}
      />
    </div>
  );
}
