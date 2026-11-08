import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { CheckIcon, CircleAlertIcon, PlusIcon } from 'lucide-react';
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
import { cn } from '@/lib';
import {
  type CreateTournamentFormValues,
  createTournamentSchema,
} from '../api';
import { useCreateTournament } from '../hooks';
import {
  type SelectedTeamEntry,
  SelectTournamentTeams,
} from './select-tournament-teams';
import { TournamentFormatPicker } from './tournament-format-picker';

const STEPS = [
  { id: 'info', label: 'Informações' },
  { id: 'format', label: 'Formato & vagas' },
  { id: 'roster', label: 'Elenco' },
] as const;

type StepId = (typeof STEPS)[number]['id'];

export const CreateTournamentDrawer = ({
  seasonId,
  seasonName,
}: {
  seasonId: string | undefined;
  seasonName?: string;
}) => {
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
  const sectionRefs = useRef<Partial<Record<StepId, HTMLDivElement>>>({});
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTournamentFormValues>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: { name: '', format: 'LEAGUE', maxTeams: '' },
  });
  const name = useWatch({ control, name: 'name' });

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

  const selectTeam = (team: TeamWithRatings) => {
    setSelectedTeams((current) => new Map(current).set(team.id, { team }));
  };

  const removeTeam = (teamId: string) => {
    setSelectedTeams((current) => {
      const next = new Map(current);
      next.delete(teamId);
      return next;
    });
  };

  const changeOwner = (teamId: string, ownerId: string | undefined) => {
    setSelectedTeams((current) => {
      const entry = current.get(teamId);
      if (!entry) {
        return current;
      }
      return new Map(current).set(teamId, { ...entry, ownerId });
    });
  };

  const maxTeamsValue = useWatch({ control, name: 'maxTeams' });
  const maxTeamsNumber = maxTeamsValue ? Number(maxTeamsValue) : undefined;
  const teamsCountMismatch =
    maxTeamsNumber !== undefined && selectedTeams.size !== maxTeamsNumber;

  const hasName = name.trim().length > 0;
  const rosterComplete =
    maxTeamsNumber !== undefined && selectedTeams.size === maxTeamsNumber;
  const activeStep: StepId = !hasName
    ? 'info'
    : maxTeamsNumber === undefined
      ? 'format'
      : 'roster';

  const scrollToStep = (step: StepId) => {
    sectionRefs.current[step]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

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

  let footStatus: { tone: 'ok' | 'warn'; text: string };
  if (!hasName) {
    footStatus = {
      tone: 'warn',
      text: 'Dê um nome ao torneio para continuar.',
    };
  } else if (maxTeamsNumber === undefined) {
    footStatus = { tone: 'warn', text: 'Escolha a quantidade de times.' };
  } else if (teamsCountMismatch) {
    const diff = maxTeamsNumber - selectedTeams.size;
    footStatus = {
      tone: 'warn',
      text:
        diff > 0
          ? `Faltam ${diff} time${diff === 1 ? '' : 's'} para completar o elenco.`
          : `Remova ${-diff} time${-diff === 1 ? '' : 's'} para encaixar no formato.`,
    };
  } else {
    footStatus = {
      tone: 'ok',
      text: 'Elenco completo — pronto para criar o torneio.',
    };
  }

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
      <SheetContent className={'data-[side=right]:sm:max-w-3xl'}>
        <SheetHeader className={'gap-2'}>
          {seasonName && (
            <span
              className={
                'font-semibold text-accent text-xs uppercase tracking-wide'
              }
            >
              {seasonName}
            </span>
          )}
          <SheetTitle className={'font-display text-2xl'}>
            {'Novo torneio'}
          </SheetTitle>
          <SheetDescription>
            {'O torneio fica vinculado à temporada selecionada no momento.'}
          </SheetDescription>

          <nav
            className={'mt-1 flex gap-1 rounded-full border bg-background p-1'}
          >
            {STEPS.map((step, index) => {
              const isActive = step.id === activeStep;
              const isDone =
                (step.id === 'info' && hasName) ||
                (step.id === 'format' && maxTeamsNumber !== undefined) ||
                (step.id === 'roster' && rosterComplete);
              return (
                <button
                  key={step.id}
                  type={'button'}
                  onClick={() => scrollToStep(step.id)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 font-medium text-xs transition-colors',
                    isActive
                      ? 'bg-surface text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-4 shrink-0 items-center justify-center rounded-full font-mono text-[10px]',
                      isDone && !isActive
                        ? 'bg-success text-white'
                        : isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-border-strong text-surface',
                    )}
                  >
                    {isDone && !isActive ? (
                      <CheckIcon className={'size-2.5'} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className={'hidden sm:inline'}>{step.label}</span>
                </button>
              );
            })}
          </nav>
        </SheetHeader>

        <form
          id={'create-tournament-form'}
          onSubmit={handleSubmit(onSubmit)}
          className={'flex-1 overflow-y-auto px-4'}
        >
          <FieldGroup>
            <div
              ref={(el) => {
                if (el) sectionRefs.current.info = el;
              }}
            >
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor={'tournament-name'}>
                  {'Nome do torneio'}
                </FieldLabel>
                <Input
                  id={'tournament-name'}
                  type={'text'}
                  placeholder={'ex.: Copa Andreaskruisen 2026'}
                  aria-invalid={!!errors.name}
                  {...register('name')}
                />
                <FieldError errors={errors.name ? [errors.name] : undefined} />
              </Field>
            </div>

            <div
              ref={(el) => {
                if (el) sectionRefs.current.format = el;
              }}
            >
              <Field data-invalid={!!errors.format || !!errors.maxTeams}>
                <FieldLabel>{'Formato & vagas'}</FieldLabel>
                <Controller
                  name={'format'}
                  control={control}
                  render={({ field }) => (
                    <TournamentFormatPicker
                      format={field.value}
                      onFormatChange={(value) => {
                        field.onChange(value);
                        setValue('maxTeams', '');
                      }}
                      maxTeams={maxTeamsValue}
                      onMaxTeamsChange={(value) => setValue('maxTeams', value)}
                      error={errors.maxTeams?.message}
                    />
                  )}
                />
              </Field>
            </div>

            <div
              ref={(el) => {
                if (el) sectionRefs.current.roster = el;
              }}
            >
              <Field data-invalid={teamsCountMismatch}>
                <FieldLabel>{'Elenco'}</FieldLabel>
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
            </div>
          </FieldGroup>
        </form>

        <SheetFooter className={'flex-row items-center justify-between gap-3'}>
          <div
            className={cn(
              'flex min-w-0 items-center gap-1.5 text-xs',
              footStatus.tone === 'ok'
                ? 'text-success'
                : 'text-muted-foreground',
            )}
          >
            {footStatus.tone === 'ok' ? (
              <CheckIcon className={'size-3.5 shrink-0'} />
            ) : (
              <CircleAlertIcon className={'size-3.5 shrink-0'} />
            )}
            <span className={'truncate'}>{footStatus.text}</span>
          </div>
          <Button
            type={'submit'}
            form={'create-tournament-form'}
            className={'w-fit shrink-0'}
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
};
