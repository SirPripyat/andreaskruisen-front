import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { PencilIcon, SquareCheckIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  SelectOptions,
} from 'src/components/ui';
import type { PositionCode } from 'src/features/admin/players';
import { useMe } from 'src/features/auth';
import {
  Formation,
  getFormationLabel,
  getOverallAtPosition,
  type RosterPlayer,
  useLineup,
  useRoster,
  useSetLineupStarter,
  useSwapLineupStarter,
  useUpdateLineupFormation,
} from 'src/features/season/squads';
import { cn, getInitials, getOverallRatingClassName } from 'src/lib';
import { TeamLineupBench } from './team-lineup-bench';
import { TeamLineupPitch } from './team-lineup-pitch';
import { TeamLineupPlayerDetail } from './team-lineup-player-detail';
import { TeamLineupStrength } from './team-lineup-strength';

type TeamLineupTabProps = {
  managerId: string | null;
};

type DragSource = { origin: 'bench' | 'pitch'; playerId: string };
type DropTarget =
  | { type: 'bench' }
  | { type: 'slot'; playerId: string | null; position: PositionCode };

export const TeamLineupTab = ({ managerId }: TeamLineupTabProps) => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useLineup(id);
  const { data: me } = useMe();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const canEditLineup = !!me && (me.role === 'ADMIN' || me.id === managerId);

  const { data: roster, isPending: isRosterPending } = useRoster(id, editMode);
  const swapStarter = useSwapLineupStarter(id);
  const setStarter = useSetLineupStarter(id);
  const updateFormation = useUpdateLineupFormation(id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const formationOptions = Object.values(Formation).map((formation) => ({
    value: formation,
    label: getFormationLabel(formation),
  }));

  const starters = data?.starters ?? [];

  const bench: RosterPlayer[] = editMode
    ? Object.values(roster ?? {})
        .flat()
        .filter((player) => !player.isStarter)
    : (data?.bench ?? []);
  const isBenchPending = editMode ? isRosterPending : isPending;

  const allPlayers = new Map(
    [...starters, ...bench].map((player) => [player.id, player]),
  );

  const xiAverage = starters.length
    ? starters.reduce(
        (sum, player) => sum + getOverallAtPosition(player, player.position),
        0,
      ) / starters.length
    : null;

  const toggleEditMode = () => {
    setEditMode((current) => !current);
    setSelectedId(null);
  };

  const handleSelect = (playerId: string) => {
    setSelectedId((current) => (current === playerId ? null : playerId));
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  // Arrastar pro banco rebaixa; arrastar pra um slot vazio promove (ou só
  // reposiciona, se quem arrastou já era titular); arrastar pra um slot
  // ocupado troca os dois — mesma ação tanto pra reserva↔titular quanto
  // pra titular↔titular (ver SwapLineupStarterUseCase no backend).
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over) return;

    const source = active.data.current as DragSource | undefined;
    const target = over.data.current as DropTarget | undefined;
    if (!source || !target) return;

    if (target.type === 'bench') {
      if (source.origin !== 'pitch') return;

      const player = allPlayers.get(source.playerId);
      setStarter.mutate(
        { playerId: source.playerId, isStarter: false },
        {
          onSuccess: () =>
            toast.success(
              player
                ? `${player.name} foi para o banco.`
                : 'Escalação atualizada.',
            ),
        },
      );
      return;
    }

    if (target.playerId === source.playerId) return;

    if (!target.playerId) {
      const player = allPlayers.get(source.playerId);
      setStarter.mutate(
        {
          playerId: source.playerId,
          isStarter: true,
          position: target.position,
        },
        {
          onSuccess: () =>
            toast.success(
              player
                ? `${player.name} agora é titular.`
                : 'Escalação atualizada.',
            ),
        },
      );
      return;
    }

    const incoming = allPlayers.get(source.playerId);
    swapStarter.mutate(
      { starterOutId: target.playerId, benchInId: source.playerId },
      {
        onSuccess: () =>
          toast.success(
            incoming
              ? `${incoming.name} agora é titular.`
              : 'Escalação atualizada.',
          ),
      },
    );
  };

  const selectedPlayer = selectedId ? allPlayers.get(selectedId) : null;
  const activePlayer = activeId
    ? allPlayers.get(activeId.replace('player:', ''))
    : null;

  if (!isPending && !data?.formation && starters.length === 0) {
    return (
      <p className={'text-center text-muted-foreground text-sm'}>
        Escalação titular ainda não foi importada para esse time.
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className={'flex flex-col gap-4'}>
        <div className={'flex flex-wrap items-center justify-between gap-3'}>
          <div className={'flex flex-wrap items-center gap-2.5'}>
            {editMode && data?.formation ? (
              <SelectOptions
                value={data.formation}
                onValueChange={(value) => {
                  updateFormation.mutate(value as Formation, {
                    onSuccess: () => toast.success('Formação atualizada.'),
                  });
                }}
                options={formationOptions}
                triggerClassName={'h-8 w-auto font-mono text-xs'}
              />
            ) : (
              <Badge
                className={
                  'border-transparent bg-accent font-mono text-accent-foreground'
                }
              >
                {getFormationLabel(data?.formation ?? null)}
              </Badge>
            )}

            {xiAverage !== null && (
              <span
                className={
                  'flex items-center gap-1.5 text-muted-foreground text-xs'
                }
              >
                Força média do XI
                <Badge
                  variant={'outline'}
                  className={cn(
                    'font-mono',
                    getOverallRatingClassName(Math.round(xiAverage)),
                  )}
                >
                  {Math.round(xiAverage)}
                </Badge>
              </span>
            )}
          </div>

          {canEditLineup && (
            <Button
              type={'button'}
              variant={editMode ? 'secondary' : 'outline'}
              size={'sm'}
              onClick={toggleEditMode}
            >
              {editMode ? <SquareCheckIcon /> : <PencilIcon />}
              {editMode ? 'Concluir edição' : 'Editar escalação'}
            </Button>
          )}
        </div>

        {editMode && (
          <p className={'text-muted-foreground text-xs'}>
            Arraste um jogador pra outro lugar do campo (ou pro banco) pra mudar
            a escalação.
          </p>
        )}

        {!editMode && selectedPlayer && (
          <TeamLineupPlayerDetail
            player={selectedPlayer}
            starters={starters}
            onClose={() => setSelectedId(null)}
          />
        )}

        <div className={'grid grid-cols-1 items-start gap-4 lg:grid-cols-2'}>
          <TeamLineupPitch
            starters={starters}
            formation={data?.formation ?? null}
            isPending={isPending}
            editable={editMode}
            onSelect={handleSelect}
          />

          <div className={'flex flex-col gap-4'}>
            <TeamLineupStrength starters={starters} />
            <div className={cn(editMode && 'max-h-[26rem] overflow-y-auto')}>
              <TeamLineupBench
                bench={bench}
                isPending={isBenchPending}
                editable={editMode}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activePlayer && (
          <div className={'flex flex-col items-center gap-1'}>
            <div className={'relative'}>
              <Avatar className={'size-16 ring-2 ring-accent'}>
                <AvatarImage src={activePlayer.photoUrl} alt={''} />
                <AvatarFallback>
                  {getInitials(activePlayer.name)}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  '-bottom-1 -right-1 absolute flex size-7 items-center justify-center rounded-full font-bold text-xs',
                  getOverallRatingClassName(
                    Math.round(
                      getOverallAtPosition(activePlayer, activePlayer.position),
                    ),
                  ),
                )}
              >
                {Math.round(
                  getOverallAtPosition(activePlayer, activePlayer.position),
                )}
              </div>
            </div>
            <span
              className={
                'rounded bg-black/80 px-2 py-0.5 font-semibold text-white text-xs'
              }
            >
              {activePlayer.name}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
