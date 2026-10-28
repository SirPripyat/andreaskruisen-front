import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarCheckIcon,
  ClockIcon,
  DicesIcon,
  PlusIcon,
  SportShoeIcon,
  VolleyballIcon,
  XIcon,
} from 'lucide-react';
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFieldArrayReturn,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Badge,
  Button,
  Field,
  FieldError,
  FieldLabel,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Skeleton,
} from '@/components/ui';
import { cn } from '@/lib';
import type { MatchDetail, MatchTeamWithPlayers } from '../api';
import {
  useMatchDetail,
  useReplaceMatchGoals,
  useSimulateMatch,
} from '../hooks';
import { PlayerCombobox } from './player-combobox';
import { TeamChip } from './team-chip';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });

const GoalRowSchema = z.object({
  scorerId: z.string().min(1, 'Selecione o artilheiro'),
  assistId: z.string(),
});

const FormSchema = z.object({
  homeGoals: z.array(GoalRowSchema),
  awayGoals: z.array(GoalRowSchema),
});

type FormValues = z.infer<typeof FormSchema>;
type GoalRow = FormValues['homeGoals'][number];
type GoalsFieldName = 'homeGoals' | 'awayGoals';

function toFormValues(match: MatchDetail | undefined): FormValues {
  if (!match) {
    return { homeGoals: [], awayGoals: [] };
  }

  const homePlayerIds = new Set(match.homeTeam.players.map((p) => p.id));
  const homeGoals: FormValues['homeGoals'] = [];
  const awayGoals: FormValues['awayGoals'] = [];

  for (const goal of match.goals) {
    const row = { scorerId: goal.scorer.id, assistId: goal.assist?.id ?? '' };
    if (homePlayerIds.has(goal.scorer.id)) {
      homeGoals.push(row);
    } else {
      awayGoals.push(row);
    }
  }

  return { homeGoals, awayGoals };
}

function TeamGoalGroup({
  side,
  team,
  fieldName,
  control,
  fieldArray,
  liveRows,
  errors,
  readOnly,
}: {
  side: 'home' | 'away';
  team: MatchTeamWithPlayers;
  fieldName: GoalsFieldName;
  control: Control<FormValues>;
  fieldArray: UseFieldArrayReturn<FormValues, GoalsFieldName>;
  liveRows: GoalRow[];
  errors: FieldErrors<FormValues>;
  readOnly: boolean;
}) {
  const { fields, append, remove } = fieldArray;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-l-4',
        side === 'home' ? 'border-l-accent' : 'border-l-border-strong',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-2 px-3 py-2',
          side === 'home' ? 'bg-accent-surface' : 'bg-muted',
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <TeamChip name={team.name} crestUrl={team.crestUrl} />
          <span className="shrink-0 text-muted-foreground text-xs">
            {fields.length === 1 ? '1 gol' : `${fields.length} gols`}
          </span>
        </div>
        {!readOnly && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append({ scorerId: '', assistId: '' })}
          >
            <PlusIcon />
            Adicionar gol
          </Button>
        )}
      </div>

      {fields.length === 0 ? (
        <div className="px-3 py-4 text-muted-foreground text-sm italic">
          Nenhum gol registrado
        </div>
      ) : (
        <div className="divide-y divide-border">
          {fields.map((field, index) => {
            const scorerId = liveRows[index]?.scorerId ?? '';
            const assistOptions = team.players.filter(
              (player) => player.id !== scorerId,
            );

            return (
              <div key={field.id} className="flex items-end gap-2 p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-muted-foreground text-xs">
                  {index + 1}
                </span>

                <Field className="min-w-0 flex-1">
                  <FieldLabel className="text-muted-foreground text-xs">
                    <VolleyballIcon className="size-3.5" />
                    Artilheiro
                  </FieldLabel>
                  <Controller
                    control={control}
                    name={`${fieldName}.${index}.scorerId`}
                    render={({ field: controllerField }) => (
                      <PlayerCombobox
                        players={team.players}
                        value={controllerField.value}
                        onValueChange={controllerField.onChange}
                        onBlur={controllerField.onBlur}
                        disabled={readOnly}
                      />
                    )}
                  />
                  <FieldError
                    errors={
                      errors[fieldName]?.[index]?.scorerId
                        ? [errors[fieldName]?.[index]?.scorerId]
                        : undefined
                    }
                  />
                </Field>

                <Field className="min-w-0 flex-1">
                  <FieldLabel className="text-muted-foreground text-xs">
                    <SportShoeIcon className="size-3.5" />
                    Assistente
                  </FieldLabel>
                  <Controller
                    control={control}
                    name={`${fieldName}.${index}.assistId`}
                    render={({ field: controllerField }) => (
                      <PlayerCombobox
                        players={assistOptions}
                        value={controllerField.value}
                        onValueChange={controllerField.onChange}
                        onBlur={controllerField.onBlur}
                        placeholder="Sem assistência"
                        disabled={readOnly || !scorerId}
                      />
                    )}
                  />
                </Field>

                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-muted-foreground hover:text-accent"
                    onClick={() => remove(index)}
                    aria-label={`Remover gol ${index + 1}`}
                  >
                    <XIcon />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RegisterMatchGoalsDrawer({
  tournamentId,
  matchId,
  open,
  onOpenChange,
}: {
  tournamentId: string;
  matchId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: match, isPending } = useMatchDetail(
    tournamentId,
    matchId ?? undefined,
  );
  const { mutate, isPending: isSaving } = useReplaceMatchGoals(
    tournamentId,
    matchId ?? undefined,
  );
  const { mutate: simulate, isPending: isSimulating } = useSimulateMatch(
    tournamentId,
    matchId ?? undefined,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { homeGoals: [], awayGoals: [] },
    values: match ? toFormValues(match) : undefined,
  });
  const homeArray = useFieldArray({ control, name: 'homeGoals' });
  const awayArray = useFieldArray({ control, name: 'awayGoals' });
  // `fields` do useFieldArray só reflete mudanças estruturais (add/remove),
  // não o valor digitado/selecionado em cada linha — por isso watch separado
  // pra saber o time do artilheiro já escolhido e liberar o campo de
  // assistência (sem isso, o campo ficava sempre desabilitado).
  const homeGoalsWatch = useWatch({ control, name: 'homeGoals' }) ?? [];
  const awayGoalsWatch = useWatch({ control, name: 'awayGoals' }) ?? [];
  const readOnly = match?.locked ?? false;

  const onSubmit = (values: FormValues) => {
    const goals = [...values.homeGoals, ...values.awayGoals].map((goal) => ({
      scorerId: goal.scorerId,
      assistId: goal.assistId === '' ? undefined : goal.assistId,
    }));

    mutate(
      { goals },
      {
        onSuccess: () => {
          toast.success('Placar registrado com sucesso.');
          onOpenChange(false);
        },
      },
    );
  };

  const handleSimulate = () => {
    simulate(undefined, {
      onSuccess: () => {
        toast.success('Resultado simulado com sucesso.');
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="data-[side=right]:sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {readOnly ? 'Detalhes da partida' : 'Registrar placar'}
          </SheetTitle>
          <SheetDescription>
            {readOnly
              ? 'Partida travada: a fase seguinte já foi gerada a partir dela, então o placar não pode mais ser editado.'
              : 'Informe o placar e, pra cada gol, quem marcou e quem deu a assistência.'}
          </SheetDescription>

          {match && (
            <div className="mt-3 flex items-center justify-between gap-3">
              <Badge
                variant="outline"
                className={cn(
                  'gap-1 border-transparent',
                  match.playedAt
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-info-surface text-info',
                )}
              >
                {match.playedAt ? (
                  <>
                    <CalendarCheckIcon className="size-3" />
                    Disputada em{' '}
                    {dateFormatter.format(new Date(match.playedAt))}
                  </>
                ) : (
                  <>
                    <ClockIcon className="size-3" />
                    Ainda não disputada
                  </>
                )}
              </Badge>

              {!match.playedAt && !readOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSimulating || isSaving}
                  onClick={handleSimulate}
                >
                  <DicesIcon />
                  {isSimulating ? 'Simulando...' : 'Simular resultado'}
                </Button>
              )}
            </div>
          )}
        </SheetHeader>

        {isPending && (
          <div className="flex flex-col gap-3 px-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {!isPending && match && (
          <form
            id="register-match-goals-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-4"
          >
            <div className="flex items-center justify-center gap-4 border-b border-dashed pb-5">
              <TeamChip
                className="flex-1"
                name={match.homeTeam.name}
                crestUrl={match.homeTeam.crestUrl}
              />
              <div className="flex shrink-0 items-center gap-2 font-mono font-bold text-3xl tabular-nums">
                <span className="text-accent">{homeArray.fields.length}</span>
                <span className="text-muted-foreground text-xl">–</span>
                <span>{awayArray.fields.length}</span>
              </div>
              <TeamChip
                className="flex-1"
                name={match.awayTeam.name}
                crestUrl={match.awayTeam.crestUrl}
                align="right"
              />
            </div>

            <div className="flex flex-col gap-4 pt-4 pb-2">
              <TeamGoalGroup
                side="home"
                team={match.homeTeam}
                fieldName="homeGoals"
                control={control}
                fieldArray={homeArray}
                liveRows={homeGoalsWatch}
                errors={errors}
                readOnly={readOnly}
              />
              <TeamGoalGroup
                side="away"
                team={match.awayTeam}
                fieldName="awayGoals"
                control={control}
                fieldArray={awayArray}
                liveRows={awayGoalsWatch}
                errors={errors}
                readOnly={readOnly}
              />
            </div>
          </form>
        )}

        <SheetFooter className="flex-row justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            {readOnly ? 'Fechar' : 'Cancelar'}
          </Button>
          {!readOnly && (
            <Button
              type="submit"
              form="register-match-goals-form"
              className="w-fit"
              disabled={isPending || isSaving || isSimulating}
            >
              {isSaving ? 'Salvando...' : 'Salvar placar'}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
