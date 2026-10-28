import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { SearchInput } from '@/components';
import {
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Skeleton,
} from '@/components/ui';
import { type TeamWithRatings, useTeams } from '@/features/teams';
import type { User } from '@/features/users';
import { useDebouncedValue } from '@/hooks';
import { cn } from '@/lib';

const PAGE_SIZE = 6;
const SKELETON_ROW_KEYS = Array.from(
  { length: PAGE_SIZE },
  (_, index) => `skeleton-squad-team-${index}`,
);

export function SelectSeasonSquads({
  users,
  squads,
  onAssign,
  onUnassign,
}: {
  users: User[];
  squads: Map<string, TeamWithRatings>;
  onAssign: (userId: string, team: TeamWithRatings) => void;
  onUnassign: (userId: string) => void;
}) {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const usedTeamIds = new Set(
    Array.from(squads.values()).map((team) => team.id),
  );

  if (users.length === 0) {
    return (
      <p className="rounded-xl border p-4 text-center text-sm text-muted-foreground">
        Nenhum usuário cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => {
        const team = squads.get(user.id);
        const isExpanded = expandedUserId === user.id;

        return (
          <div key={user.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-xl border p-2 text-sm">
              <span className="min-w-0 flex-1 truncate font-medium">
                {user.name}
              </span>

              {team ? (
                <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                  <img
                    src={team.crestUrl}
                    alt=""
                    className="size-5 shrink-0 object-contain"
                    onError={(event) => {
                      event.currentTarget.style.visibility = 'hidden';
                    }}
                  />
                  <span className="truncate">{team.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground text-xs">Sem time</span>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
              >
                {team ? 'Alterar' : 'Selecionar time'}
              </Button>

              {team && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onUnassign(user.id)}
                  aria-label={`Remover time de ${user.name}`}
                >
                  <XIcon />
                </Button>
              )}
            </div>

            {isExpanded && (
              <TeamPicker
                excludeTeamIds={usedTeamIds}
                onSelect={(selected) => {
                  onAssign(user.id, selected);
                  setExpandedUserId(null);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TeamPicker({
  excludeTeamIds,
  onSelect,
}: {
  excludeTeamIds: Set<string>;
  onSelect: (team: TeamWithRatings) => void;
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

  const teams = data?.data ?? [];

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-2">
      <SearchInput
        value={draftName}
        onChange={(value) => {
          setDraftName(value);
          setPage(1);
        }}
        placeholder="Buscar time..."
        className="max-w-full"
      />

      <div className="max-h-56 divide-y overflow-y-auto rounded-lg border bg-background">
        {isPending &&
          SKELETON_ROW_KEYS.map((rowKey) => (
            <div key={rowKey} className="flex items-center gap-2 p-2">
              <Skeleton className="size-6 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-full max-w-40" />
            </div>
          ))}

        {!isPending && teams.length === 0 && (
          <div className="flex h-20 items-center justify-center text-muted-foreground text-sm">
            Nenhum time encontrado.
          </div>
        )}

        {!isPending &&
          teams.map((team) => {
            const isTaken = excludeTeamIds.has(team.id);
            return (
              <button
                key={team.id}
                type="button"
                disabled={isTaken}
                onClick={() => onSelect(team)}
                className={cn(
                  'flex w-full items-center gap-2 p-2 text-left text-sm hover:bg-muted/50',
                  isTaken && 'opacity-50 hover:bg-transparent',
                )}
              >
                <img
                  src={team.crestUrl}
                  alt=""
                  className="size-6 shrink-0 object-contain"
                  onError={(event) => {
                    event.currentTarget.style.visibility = 'hidden';
                  }}
                />
                <span className="min-w-0 flex-1 truncate">{team.name}</span>
                {isTaken && (
                  <span className="shrink-0 text-muted-foreground text-xs">
                    Já atribuído
                  </span>
                )}
              </button>
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
