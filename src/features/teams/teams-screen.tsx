import {
  type ColumnDef,
  getCoreRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from 'nuqs';
import { useEffect, useState } from 'react';
import { PageHeader, SearchInput } from '@/components';
import {
  Badge,
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
} from '@/components/ui';
import { useDebouncedValue } from '@/hooks';
import { getOverallRatingClassName, type SortOrder } from '@/lib';
import type { TeamSortField, TeamWithRatings } from './api';
import { useTeams } from './hooks';

const PAGE_SIZE = 10;

const numberFormatter = new Intl.NumberFormat('pt-BR');

function RatingBadge({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-muted-foreground">-</span>;
  }
  const rounded = Math.round(value);
  return (
    <Badge variant="outline" className={getOverallRatingClassName(rounded)}>
      {rounded}
    </Badge>
  );
}

const columns: ColumnDef<TeamWithRatings>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Equipe</DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.crestUrl}
          alt=""
          className="size-8 object-contain"
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden';
          }}
        />
        <span className="font-medium">{row.original.name}</span>
      </div>
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
    cell: ({ row }) => (
      <RatingBadge value={row.original.averageOverallRating} />
    ),
  },
  {
    id: 'averageAttackRating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Ataque</DataTableColumnHeader>
    ),
    sortDescFirst: true,
    cell: ({ row }) => <RatingBadge value={row.original.averageAttackRating} />,
  },
  {
    id: 'averageMidfieldRating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Meio-campo</DataTableColumnHeader>
    ),
    sortDescFirst: true,
    cell: ({ row }) => (
      <RatingBadge value={row.original.averageMidfieldRating} />
    ),
  },
  {
    id: 'averageDefenseRating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Defesa</DataTableColumnHeader>
    ),
    sortDescFirst: true,
    cell: ({ row }) => (
      <RatingBadge value={row.original.averageDefenseRating} />
    ),
  },
];

export function TeamsScreen() {
  const [name, setName] = useQueryState('name', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [sortBy, setSortBy] = useQueryState(
    'sortBy',
    parseAsStringEnum<TeamSortField>([
      'name',
      'averageOverallRating',
      'averageDefenseRating',
      'averageMidfieldRating',
      'averageAttackRating',
    ]).withDefault('averageOverallRating'),
  );
  const [sortOrder, setSortOrder] = useQueryState(
    'sortOrder',
    parseAsStringEnum<SortOrder>(['asc', 'desc']).withDefault('desc'),
  );

  const [draftName, setDraftName] = useState(name);
  const debouncedName = useDebouncedValue(draftName, 400);

  useEffect(() => {
    if (debouncedName !== name) {
      setName(debouncedName || null);
    }
  }, [debouncedName, name, setName]);

  function handleSearchChange(value: string) {
    setDraftName(value);
    setPage(1);
  }

  const { data, isPending, isError, error } = useTeams({
    name: name || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const teams = data?.data ?? [];

  const sorting: SortingState = [{ id: sortBy, desc: sortOrder === 'desc' }];

  const table = useReactTable({
    data: teams,
    columns,
    state: { sorting },
    manualSorting: true,
    enableSortingRemoval: false,
    onSortingChange: (updater) => {
      const next = (
        typeof updater === 'function' ? updater(sorting) : updater
      )[0];
      if (!next) return;
      setSortBy(next.id as TeamSortField);
      setSortOrder(next.desc ? 'desc' : 'asc');
      setPage(1);
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <PageHeader
        title="Times"
        description="Times e ligas monitorados, com médias de avaliação por linha do elenco."
      />

      <div className="flex items-center gap-2">
        <SearchInput
          value={draftName}
          onChange={handleSearchChange}
          placeholder="Buscar time..."
        />
        {data && (
          <span className="ml-auto text-muted-foreground text-sm">
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
        errorMessage="Não foi possível carregar os times."
        emptyMessage="Nenhum time encontrado."
        skeletonRowCount={PAGE_SIZE}
      />

      {data && (
        <DataTablePagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
