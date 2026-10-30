import { PlusIcon, SparklesIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SearchInput } from '@/components';
import {
  Badge,
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@/components/ui';
import {
  listTeams,
  type TeamWithRatings,
  useTeams,
} from '@/features/admin/teams';
import { useUsers } from '@/features/admin/users';
import { useDebouncedValue } from '@/hooks';
import { cn, getErrorMessage, getOverallRatingClassName } from '@/lib';

export type SelectedTeamEntry = {
  team: TeamWithRatings;
  ownerId?: string;
};

const CPU_OPTION = 'cpu';
const PAGE_SIZE = 8;
const SKELETON_ROW_KEYS = Array.from(
  { length: PAGE_SIZE },
  (_, index) => `skeleton-team-row-${index}`,
);

export function SelectTournamentTeams({
  selectedTeams,
  onSelect,
  onRemove,
  onOwnerChange,
  maxTeams,
  canAssignOwners,
}: {
  selectedTeams: Map<string, SelectedTeamEntry>;
  onSelect: (team: TeamWithRatings) => void;
  onRemove: (teamId: string) => void;
  onOwnerChange: (teamId: string, ownerId: string | undefined) => void;
  maxTeams?: number;
  canAssignOwners: boolean;
}) {
  const [draftName, setDraftName] = useState('');
  const [page, setPage] = useState(1);
  const debouncedName = useDebouncedValue(draftName, 400);

  const { data, isPending } = useTeams({
    name: debouncedName || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy: 'averageOverallRating',
    sortOrder: 'desc',
  });
  const { data: users } = useUsers({ enabled: canAssignOwners });
  const [isFilling, setIsFilling] = useState(false);

  const teams = data?.data ?? [];
  const isLimitReached =
    maxTeams !== undefined && selectedTeams.size >= maxTeams;
  const remaining = maxTeams !== undefined ? maxTeams - selectedTeams.size : 0;
  const usedOwnerIds = new Set(
    Array.from(selectedTeams.values())
      .map((entry) => entry.ownerId)
      .filter((ownerId): ownerId is string => !!ownerId),
  );

  async function handleFillRemaining() {
    if (maxTeams === undefined || remaining <= 0) {
      return;
    }
    setIsFilling(true);
    try {
      const result = await listTeams({
        page: 1,
        pageSize: maxTeams,
        sortBy: 'averageOverallRating',
        sortOrder: 'desc',
      });
      result.data
        .filter((team) => !selectedTeams.has(team.id))
        .slice(0, remaining)
        .forEach((team) => {
          onSelect(team);
        });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível completar os times.'));
    } finally {
      setIsFilling(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {selectedTeams.size > 0 && (
        <div className="flex flex-col gap-1.5 rounded-xl border p-2">
          {Array.from(selectedTeams.values()).map(({ team, ownerId }) => (
            <div key={team.id} className="flex items-center gap-2 text-sm">
              <img
                src={team.crestUrl}
                alt=""
                className="size-6 shrink-0 object-contain"
                onError={(event) => {
                  event.currentTarget.style.visibility = 'hidden';
                }}
              />
              <span className="min-w-0 flex-1 truncate font-medium">
                {team.name}
              </span>
              {canAssignOwners && (
                <Select
                  value={ownerId ?? CPU_OPTION}
                  onValueChange={(value) =>
                    onOwnerChange(
                      team.id,
                      value === CPU_OPTION ? undefined : value,
                    )
                  }
                  items={[
                    { value: CPU_OPTION, label: 'CPU (sem dono)' },
                    ...(users ?? []).map((user) => ({
                      value: user.id,
                      label: user.name,
                    })),
                  ]}
                >
                  <SelectTrigger className="h-7 w-40 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CPU_OPTION}>CPU (sem dono)</SelectItem>
                    {users?.map((user) => (
                      <SelectItem
                        key={user.id}
                        value={user.id}
                        disabled={
                          usedOwnerIds.has(user.id) && user.id !== ownerId
                        }
                      >
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(team.id)}
                aria-label={`Remover ${team.name}`}
              >
                <XIcon />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <SearchInput
          value={draftName}
          onChange={(value) => {
            setDraftName(value);
            setPage(1);
          }}
          placeholder="Buscar time..."
          className="max-w-full"
        />
        <span
          className={cn(
            'shrink-0 text-sm',
            isLimitReached ? 'text-warning' : 'text-muted-foreground',
          )}
        >
          {selectedTeams.size}
          {maxTeams !== undefined ? `/${maxTeams}` : ''} selecionado
          {selectedTeams.size === 1 ? '' : 's'}
        </span>
        {maxTeams !== undefined && remaining > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFilling}
            onClick={handleFillRemaining}
            className="shrink-0"
          >
            <SparklesIcon />
            {isFilling
              ? 'Completando...'
              : `Completar com os ${remaining} melhores`}
          </Button>
        )}
      </div>

      <div className="max-h-72 divide-y overflow-y-auto rounded-xl border">
        {isPending &&
          SKELETON_ROW_KEYS.map((rowKey) => (
            <div key={rowKey} className="flex items-center gap-2 p-2">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <Skeleton className="h-5 w-full max-w-40" />
            </div>
          ))}

        {!isPending && teams.length === 0 && (
          <div className="flex h-24 items-center justify-center text-muted-foreground text-sm">
            Nenhum time encontrado.
          </div>
        )}

        {!isPending &&
          teams.map((team) => {
            const isSelected = selectedTeams.has(team.id);
            return (
              <div
                key={team.id}
                className="flex items-center gap-2 p-2 text-sm"
              >
                <img
                  src={team.crestUrl}
                  alt=""
                  className="size-8 shrink-0 object-contain"
                  onError={(event) => {
                    event.currentTarget.style.visibility = 'hidden';
                  }}
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">{team.name}</span>
                  <span className="truncate text-muted-foreground text-xs">
                    {team.league.name}
                  </span>
                </div>
                {team.averageOverallRating !== null && (
                  <Badge
                    variant="outline"
                    className={getOverallRatingClassName(
                      Math.round(team.averageOverallRating),
                    )}
                  >
                    {Math.round(team.averageOverallRating)}
                  </Badge>
                )}
                <Button
                  type="button"
                  variant={isSelected ? 'secondary' : 'outline'}
                  size="sm"
                  disabled={!isSelected && isLimitReached}
                  onClick={() =>
                    isSelected ? onRemove(team.id) : onSelect(team)
                  }
                  className={cn(isSelected && 'text-destructive')}
                >
                  {isSelected ? (
                    <>
                      <XIcon />
                      Remover
                    </>
                  ) : (
                    <>
                      <PlusIcon />
                      Selecionar
                    </>
                  )}
                </Button>
              </div>
            );
          })}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination className="mx-0 w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Anterior"
                onClick={(event) => {
                  event.preventDefault();
                  setPage((current) => Math.max(1, current - 1));
                }}
                aria-disabled={page === 1}
                className={cn(page === 1 && 'pointer-events-none opacity-50')}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                text="Próxima"
                onClick={(event) => {
                  event.preventDefault();
                  setPage((current) => Math.min(data.totalPages, current + 1));
                }}
                aria-disabled={page === data.totalPages}
                className={cn(
                  page === data.totalPages && 'pointer-events-none opacity-50',
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
