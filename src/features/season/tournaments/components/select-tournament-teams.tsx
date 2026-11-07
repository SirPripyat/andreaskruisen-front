import { PlusIcon, SparklesIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { OverallRatingBadge, SearchInput, TeamCell } from '@/components';
import {
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
import { cn, getErrorMessage } from '@/lib';

export type SelectedTeamEntry = {
  team: TeamWithRatings;
  ownerId?: string;
};

const CPU_OPTION = 'cpu';
const PAGE_SIZE = 6;
const RING_RADIUS = 24;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const SKELETON_ROW_KEYS = Array.from(
  { length: PAGE_SIZE },
  (_, index) => `skeleton-team-row-${index}`,
);

export const SelectTournamentTeams = ({
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
}) => {
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
  const ringRatio = maxTeams ? Math.min(1, selectedTeams.size / maxTeams) : 0;
  const ringComplete = !!maxTeams && selectedTeams.size === maxTeams;

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
    <div className={'grid gap-4 md:grid-cols-[1fr_17rem]'}>
      <div className={'flex min-w-0 flex-col gap-3'}>
        <div className={'flex items-center gap-2'}>
          <SearchInput
            value={draftName}
            onChange={(value) => {
              setDraftName(value);
              setPage(1);
            }}
            placeholder={'Buscar time...'}
            className={'max-w-full'}
          />
          {maxTeams !== undefined && remaining > 0 && (
            <Button
              type={'button'}
              variant={'outline'}
              size={'sm'}
              disabled={isFilling}
              onClick={handleFillRemaining}
              className={'shrink-0'}
            >
              <SparklesIcon />
              {isFilling ? 'Completando...' : `+${remaining} melhores`}
            </Button>
          )}
        </div>

        <div className={'divide-y overflow-hidden rounded-xl border'}>
          {isPending &&
            SKELETON_ROW_KEYS.map((rowKey) => (
              <div key={rowKey} className={'flex items-center gap-2 p-2'}>
                <Skeleton className={'size-8 shrink-0 rounded-full'} />
                <Skeleton className={'h-5 w-full max-w-40'} />
              </div>
            ))}

          {!isPending && teams.length === 0 && (
            <div
              className={
                'flex h-24 items-center justify-center text-muted-foreground text-sm'
              }
            >
              {'Nenhum time encontrado.'}
            </div>
          )}

          {!isPending &&
            teams.map((team) => {
              const isSelected = selectedTeams.has(team.id);
              return (
                <div
                  key={team.id}
                  className={'flex items-center gap-2 p-2 text-sm'}
                >
                  <div className={'min-w-0 flex-1'}>
                    <TeamCell
                      crestUrl={team.crestUrl}
                      name={team.name}
                      size={'md'}
                    />
                    <span
                      className={
                        'block truncate pl-8 text-muted-foreground text-xs'
                      }
                    >
                      {team.league.name}
                    </span>
                  </div>
                  <OverallRatingBadge rating={team.averageOverallRating} />
                  <Button
                    type={'button'}
                    variant={isSelected ? 'secondary' : 'outline'}
                    size={'sm'}
                    disabled={!isSelected && isLimitReached}
                    onClick={() =>
                      isSelected ? onRemove(team.id) : onSelect(team)
                    }
                    className={cn(isSelected && 'text-destructive')}
                  >
                    {isSelected ? (
                      <>
                        <XIcon />
                        {'Remover'}
                      </>
                    ) : (
                      <>
                        <PlusIcon />
                        {'Selecionar'}
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
        </div>

        {data && data.totalPages > 1 && (
          <Pagination className={'mx-0 w-fit'}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={'#'}
                  text={'Anterior'}
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
                  href={'#'}
                  text={'Próxima'}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((current) =>
                      Math.min(data.totalPages, current + 1),
                    );
                  }}
                  aria-disabled={page === data.totalPages}
                  className={cn(
                    page === data.totalPages &&
                      'pointer-events-none opacity-50',
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <div
        className={
          'flex flex-col gap-3 rounded-xl border bg-background p-3 md:sticky md:top-0 md:self-start'
        }
      >
        <div className={'flex items-center gap-3'}>
          <svg
            width={56}
            height={56}
            viewBox={'0 0 56 56'}
            className={'shrink-0'}
            aria-hidden={'true'}
          >
            <circle
              cx={28}
              cy={28}
              r={RING_RADIUS}
              fill={'none'}
              stroke={'var(--color-border)'}
              strokeWidth={5}
            />
            <circle
              cx={28}
              cy={28}
              r={RING_RADIUS}
              fill={'none'}
              stroke={
                ringComplete ? 'var(--color-success)' : 'var(--color-accent)'
              }
              strokeWidth={5}
              strokeLinecap={'round'}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - ringRatio)}
              transform={'rotate(-90 28 28)'}
              className={'transition-all'}
            />
          </svg>
          <div className={'flex flex-col'}>
            <span className={'font-mono font-semibold text-lg tabular-nums'}>
              {selectedTeams.size}/{maxTeams ?? '—'}
            </span>
            <span className={'text-muted-foreground text-xs'}>
              {'times no elenco'}
            </span>
          </div>
        </div>

        <div className={'flex max-h-72 flex-col gap-1.5 overflow-y-auto'}>
          {selectedTeams.size === 0 ? (
            <div
              className={
                'rounded-lg border border-dashed p-4 text-center text-muted-foreground text-xs'
              }
            >
              {'Nenhum time no elenco ainda. Selecione times na lista ao lado.'}
            </div>
          ) : (
            Array.from(selectedTeams.values()).map(({ team, ownerId }) => (
              <div
                key={team.id}
                className={
                  'flex items-center gap-1.5 rounded-lg border bg-surface p-1.5'
                }
              >
                <img
                  src={team.crestUrl}
                  alt={''}
                  className={'size-4 shrink-0 object-contain'}
                  onError={(event) => {
                    event.currentTarget.style.visibility = 'hidden';
                  }}
                />
                <span className={'min-w-0 flex-1 truncate font-medium text-xs'}>
                  {team.name}
                </span>
                {canAssignOwners && (
                  <Select
                    value={ownerId ?? CPU_OPTION}
                    onValueChange={(value) =>
                      onOwnerChange(
                        team.id,
                        value === CPU_OPTION ? undefined : (value as string),
                      )
                    }
                    items={[
                      { value: CPU_OPTION, label: 'CPU' },
                      ...(users ?? []).map((user) => ({
                        value: user.id,
                        label: user.name,
                      })),
                    ]}
                  >
                    <SelectTrigger className={'h-6 w-20 px-1.5 text-[11px]'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CPU_OPTION}>{'CPU'}</SelectItem>
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
                  type={'button'}
                  variant={'ghost'}
                  size={'icon-xs'}
                  onClick={() => onRemove(team.id)}
                  aria-label={`Remover ${team.name}`}
                >
                  <XIcon />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
