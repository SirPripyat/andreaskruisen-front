import {
  type ColumnDef,
  getCoreRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { UploadIcon } from 'lucide-react';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from 'nuqs';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PageHeader, SearchInput } from '@/components';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
} from '@/components/ui';
import { useDebouncedValue } from '@/hooks';
import { getOverallRatingClassName, type SortOrder } from '@/lib';
import { useUserStore } from '@/stores';
import type { PlayerListItem, PlayerSortField } from './api';
import { usePlayers } from './hooks';

const PAGE_SIZE = 10;

const numberFormatter = new Intl.NumberFormat('pt-BR');

const PREFERRED_FOOT_LABELS: Record<string, string> = {
  LEFT: 'Canhoto',
  RIGHT: 'Destro',
  BOTH: 'Ambidestro',
};

function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatPreferredFoot(value: string) {
  return PREFERRED_FOOT_LABELS[value.toUpperCase()] ?? formatEnumLabel(value);
}

function calculateAge(birthdate: string) {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }
  return age;
}

function getPositionGroupClassName(position: string) {
  if (/GOALKEEPER|^GK$/.test(position)) {
    return 'border-transparent bg-warning-surface text-warning';
  }
  if (/BACK|DEFENDER|^(CB|LB|RB|LWB|RWB)$/.test(position)) {
    return 'border-transparent bg-info-surface text-info';
  }
  if (/MID|^(CDM|CM|CAM|LM|RM)$/.test(position)) {
    return 'border-transparent bg-success-surface text-success';
  }
  if (/WING|STRIKER|FORWARD|^(LW|RW|CF|ST)$/.test(position)) {
    return 'border-transparent bg-accent-surface text-accent';
  }
  return '';
}

const columns: ColumnDef<PlayerListItem>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Jogador</DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={row.original.photoUrl} alt="" />
          <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    id: 'positions',
    header: 'Posições',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.positions.map((position) => (
          <Badge
            key={position.position}
            variant="outline"
            className={
              position.isPrimary
                ? getPositionGroupClassName(position.position)
                : undefined
            }
          >
            {position.position}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: 'team',
    header: 'Equipe',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.team.crestUrl}
          alt=""
          className="size-6 object-contain"
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden';
          }}
        />
        <span>{row.original.team.name}</span>
      </div>
    ),
  },
  {
    id: 'nationality',
    header: 'Nacionalidade',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar size="sm" className="bg-muted">
          <AvatarImage
            src={row.original.nationality.flagUrl}
            className="aspect-square size-full scale-[1.9]"
            alt=""
          />
          <AvatarFallback>
            {row.original.nationality.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span>{row.original.nationality.name}</span>
      </div>
    ),
  },
  {
    id: 'foot',
    header: 'Pé preferido',
    cell: ({ row }) => formatPreferredFoot(row.original.preferredFoot),
  },
  {
    id: 'overallRating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Overall</DataTableColumnHeader>
    ),
    sortDescFirst: true,
    cell: ({ row }) =>
      row.original.latestRating ? (
        <Badge
          variant="outline"
          className={getOverallRatingClassName(
            row.original.latestRating.overallRating,
          )}
        >
          {row.original.latestRating.overallRating}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      ),
  },
  {
    id: 'age',
    header: 'Idade',
    cell: ({ row }) => calculateAge(row.original.birthdate),
  },
];

export function PlayersScreen() {
  const { user } = useUserStore();
  const [name, setName] = useQueryState('name', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [sortBy, setSortBy] = useQueryState(
    'sortBy',
    parseAsStringEnum<PlayerSortField>(['name', 'overallRating']).withDefault(
      'overallRating',
    ),
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

  const { data, isPending, isError, error } = usePlayers({
    name: name || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const players = data?.data ?? [];

  const sorting: SortingState = [{ id: sortBy, desc: sortOrder === 'desc' }];

  const table = useReactTable({
    data: players,
    columns,
    state: { sorting },
    manualSorting: true,
    enableSortingRemoval: false,
    onSortingChange: (updater) => {
      const next = (
        typeof updater === 'function' ? updater(sorting) : updater
      )[0];
      if (!next) return;
      setSortBy(next.id as PlayerSortField);
      setSortOrder(next.desc ? 'desc' : 'asc');
      setPage(1);
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <PageHeader
        title="Jogadores"
        description="Base de jogadores extraída do scraper, com posições, nacionalidade e avaliações."
        actions={
          user?.role === 'ADMIN' ? (
            <Button variant="outline" render={<Link to="/players/import" />}>
              <UploadIcon />
              Importar
            </Button>
          ) : undefined
        }
      />

      <div className="flex items-center gap-2">
        <SearchInput
          value={draftName}
          onChange={handleSearchChange}
          placeholder="Buscar jogador..."
        />
        {data && (
          <span className="ml-auto text-muted-foreground text-sm">
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
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
