import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import type { TeamWithRatings } from '@/features/admin/teams';
import { assignSquad, useSeasonSquads } from '@/features/season/squads';
import {
  type CreateTournamentFormValues,
  createTournamentSchema,
  TEAM_COUNT_RULES,
  TOURNAMENT_FORMAT_LABELS,
  TOURNAMENT_FORMATS,
} from '../api';
import { useCreateTournament } from '../hooks';
import {
  type SelectedTeamEntry,
  SelectTournamentTeams,
} from './select-tournament-teams';

export function CreateTournamentDrawer({
  seasonId,
}: {
  seasonId: string | undefined;
}) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<
    Map<string, SelectedTeamEntry>
  >(new Map());
  const [isLinkingTeams, setIsLinkingTeams] = useState(false);
  const { data: seasonSquads } = useSeasonSquads(open ? seasonId : undefined);
  const hasSeededSquadsRef = useRef(false);
  const preexistingSquadsRef = useRef<Set<string>>(new Set());
  const { mutateAsync, isPending: isCreating } = useCreateTournament(seasonId);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTournamentFormValues>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: { name: '', format: 'GROUP_STAGE', maxTeams: '' },
  });
  const format = useWatch({ control, name: 'format' });
  const formatRule = TEAM_COUNT_RULES[format];

  // Ao abrir o drawer, já traz os times que os usuários escolheram/foram
  // atribuídos na temporada, pra não ter que selecionar tudo de novo.
  useEffect(() => {
    if (!open) {
      hasSeededSquadsRef.current = false;
      return;
    }
    if (
      hasSeededSquadsRef.current ||
      !seasonSquads ||
      seasonSquads.length === 0
    ) {
      return;
    }
    hasSeededSquadsRef.current = true;
    preexistingSquadsRef.current = new Set(
      seasonSquads.map((squad) => `${squad.teamId}:${squad.userId}`),
    );
    setSelectedTeams(
      new Map(
        seasonSquads.map((squad) => [
          squad.teamId,
          {
            team: {
              id: squad.team.id,
              name: squad.team.name,
              crestUrl: squad.team.crestUrl,
              league: squad.team.league,
              averageOverallRating: null,
              averageDefenseRating: null,
              averageMidfieldRating: null,
              averageAttackRating: null,
            },
            ownerId: squad.userId,
          },
        ]),
      ),
    );
  }, [open, seasonSquads]);

  function selectTeam(team: TeamWithRatings) {
    setSelectedTeams((current) => new Map(current).set(team.id, { team }));
  }

  function removeTeam(teamId: string) {
    setSelectedTeams((current) => {
      const next = new Map(current);
      next.delete(teamId);
      return next;
    });
  }

  function changeOwner(teamId: string, ownerId: string | undefined) {
    setSelectedTeams((current) => {
      const entry = current.get(teamId);
      if (!entry) {
        return current;
      }
      return new Map(current).set(teamId, { ...entry, ownerId });
    });
  }

  const maxTeamsValue = useWatch({ control, name: 'maxTeams' });
  const maxTeamsNumber = maxTeamsValue ? Number(maxTeamsValue) : undefined;
  const teamsCountMismatch =
    maxTeamsNumber !== undefined && selectedTeams.size !== maxTeamsNumber;

  const onSubmit = async (values: CreateTournamentFormValues) => {
    if (teamsCountMismatch) {
      toast.error(
        `Selecione exatamente ${maxTeamsNumber} time${maxTeamsNumber === 1 ? '' : 's'} (atualmente ${selectedTeams.size}).`,
      );
      return;
    }

    try {
      const entries = Array.from(selectedTeams.values());

      const created = await mutateAsync({
        name: values.name,
        format: values.format,
        maxTeams: Number(values.maxTeams),
        teamIds: entries.map(({ team }) => team.id),
      });

      const ownerEntries = entries.filter(
        (entry) =>
          entry.ownerId &&
          !preexistingSquadsRef.current.has(
            `${entry.team.id}:${entry.ownerId}`,
          ),
      );

      if (ownerEntries.length > 0) {
        setIsLinkingTeams(true);
        const ownerResults = await Promise.allSettled(
          ownerEntries.map((entry) =>
            assignSquad(created.seasonId, {
              userId: entry.ownerId as string,
              teamId: entry.team.id,
            }),
          ),
        );
        setIsLinkingTeams(false);

        queryClient.invalidateQueries({
          queryKey: ['squads', created.seasonId],
        });

        const ownerFailures = ownerResults.filter(
          (r) => r.status === 'rejected',
        );
        if (ownerFailures.length > 0) {
          toast.error(
            `${ownerFailures.length} dono${ownerFailures.length === 1 ? '' : 's'} de time não ${ownerFailures.length === 1 ? 'pôde' : 'puderam'} ser vinculado${ownerFailures.length === 1 ? '' : 's'}.`,
          );
        }
      }

      toast.success(`Torneio "${created.name}" criado com sucesso.`);
      reset();
      setSelectedTeams(new Map());
      setOpen(false);
    } catch {
      // Erro de criação do torneio já é reportado pelo toast global de
      // mutation (ver meta.errorMessage em useCreateTournament); aqui só
      // precisamos impedir que o fluxo de vínculo de donos/sucesso continue.
    }
  };

  const isSubmitting = isCreating || isLinkingTeams;

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset();
          setSelectedTeams(new Map());
          preexistingSquadsRef.current = new Set();
        }
      }}
    >
      <SheetTrigger
        render={
          <Button disabled={!seasonId}>
            <PlusIcon />
            Criar torneio
          </Button>
        }
      />
      <SheetContent className="data-[side=right]:sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Novo torneio</SheetTitle>
          <SheetDescription>
            O torneio fica vinculado à temporada selecionada no momento.
          </SheetDescription>
        </SheetHeader>

        <form
          id="create-tournament-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4"
        >
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="tournament-name">Nome</FieldLabel>
              <Input
                id="tournament-name"
                type="text"
                placeholder="ex.: Copa Andreaskruisen 2026"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.format}>
                <FieldLabel htmlFor="tournament-format">Formato</FieldLabel>
                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue('maxTeams', '');
                      }}
                      items={TOURNAMENT_FORMATS.map((item) => ({
                        value: item,
                        label: TOURNAMENT_FORMAT_LABELS[item],
                      }))}
                    >
                      <SelectTrigger
                        id="tournament-format"
                        onBlur={field.onBlur}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TOURNAMENT_FORMATS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {TOURNAMENT_FORMAT_LABELS[item]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError
                  errors={errors.format ? [errors.format] : undefined}
                />
              </Field>

              <Field data-invalid={!!errors.maxTeams}>
                <FieldLabel htmlFor="tournament-max-teams">
                  Qtd máx de times
                </FieldLabel>
                {formatRule.allowed ? (
                  <Controller
                    name="maxTeams"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="tournament-max-teams"
                          onBlur={field.onBlur}
                          aria-invalid={!!errors.maxTeams}
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {formatRule.allowed?.map((count) => (
                            <SelectItem key={count} value={String(count)}>
                              {count}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input
                    id="tournament-max-teams"
                    type="number"
                    min={formatRule.min}
                    max={formatRule.max}
                    placeholder={`${formatRule.min} a ${formatRule.max}`}
                    aria-invalid={!!errors.maxTeams}
                    {...register('maxTeams')}
                  />
                )}
                <FieldError
                  errors={errors.maxTeams ? [errors.maxTeams] : undefined}
                />
              </Field>
            </div>

            <Field data-invalid={teamsCountMismatch}>
              <FieldLabel>Times</FieldLabel>
              <SelectTournamentTeams
                selectedTeams={selectedTeams}
                onSelect={selectTeam}
                onRemove={removeTeam}
                onOwnerChange={changeOwner}
                maxTeams={maxTeamsNumber}
                canAssignOwners={true}
              />
              {teamsCountMismatch && (
                <FieldError>
                  Selecione exatamente {maxTeamsNumber} time
                  {maxTeamsNumber === 1 ? '' : 's'} (atualmente{' '}
                  {selectedTeams.size}).
                </FieldError>
              )}
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter className="items-end">
          <Button
            type="submit"
            form="create-tournament-form"
            className="w-fit"
            disabled={
              isSubmitting || maxTeamsNumber === undefined || teamsCountMismatch
            }
          >
            {isSubmitting ? 'Criando...' : 'Criar torneio'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
