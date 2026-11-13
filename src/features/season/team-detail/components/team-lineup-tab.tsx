import { PencilIcon, SquareCheckIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { Badge, Button, SelectOptions } from 'src/components/ui';
import { useMe } from 'src/features/auth';
import {
  Formation,
  getFormationLabel,
  type RosterPlayer,
  useLineup,
  useRoster,
  useSwapLineupStarter,
  useUpdateLineupFormation,
} from 'src/features/season/squads';
import { cn, getOverallRatingClassName } from 'src/lib';
import { TeamLineupBench } from './team-lineup-bench';
import { TeamLineupPitch } from './team-lineup-pitch';
import { TeamLineupStrength } from './team-lineup-strength';

type TeamLineupTabProps = {
  managerId: string | null;
};

export const TeamLineupTab = ({ managerId }: TeamLineupTabProps) => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useLineup(id);
  const { data: me } = useMe();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const canEditLineup = !!me && (me.role === 'ADMIN' || me.id === managerId);

  const { data: roster, isPending: isRosterPending } = useRoster(id, editMode);
  const swapStarter = useSwapLineupStarter(id);
  const updateFormation = useUpdateLineupFormation(id);

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

  const xiAverage = starters.length
    ? starters.reduce((sum, player) => sum + player.overallRating, 0) /
      starters.length
    : null;

  const toggleEditMode = () => {
    setEditMode((current) => !current);
    setSelectedId(null);
  };

  const handleSelect = (playerId: string) => {
    if (!editMode) {
      setSelectedId(playerId);
      return;
    }

    if (!selectedId || selectedId === playerId) {
      setSelectedId(selectedId === playerId ? null : playerId);
      return;
    }

    const starterOutId = selectedId;
    const benchInId = playerId;
    const promoted = bench.find(
      (player) => player.id === starterOutId || player.id === benchInId,
    );

    setSelectedId(null);
    swapStarter.mutate(
      { starterOutId, benchInId },
      {
        onSuccess: () => {
          toast.success(
            promoted
              ? `${promoted.name} agora é titular.`
              : 'Escalação atualizada.',
          );
        },
      },
    );
  };

  if (!isPending && starters.length === 0) {
    return (
      <p className={'text-center text-muted-foreground text-sm'}>
        Escalação titular ainda não foi importada para esse time.
      </p>
    );
  }

  return (
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
          Clique num titular e depois num reserva (ou na ordem inversa) pra
          trocá-los.
        </p>
      )}

      <div className={'grid grid-cols-1 items-start gap-4 lg:grid-cols-2'}>
        <TeamLineupPitch
          lineup={starters}
          formation={data?.formation ?? null}
          isPending={isPending}
          selectedId={selectedId}
          onSelect={handleSelect}
        />

        <div className={'flex flex-col gap-4'}>
          <TeamLineupStrength starters={starters} />
          <div className={cn(editMode && 'max-h-[26rem] overflow-y-auto')}>
            <TeamLineupBench
              bench={bench}
              isPending={isBenchPending}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
