import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from 'src/components/ui';
import {
  useMatchDetail,
  useReplaceMatchGoals,
  useSimulateMatch,
} from '../../hooks';
import { FormSchema, type FormValues, toFormValues } from './goals-form-schema';
import { MatchScoreStrip } from './match-score-strip';
import { MatchStatusBar } from './match-status-bar';
import { TeamGoalGroup } from './team-goal-group';

type RegisterMatchGoalsDrawerProps = {
  tournamentId: string;
  matchId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const RegisterMatchGoalsDrawer = ({
  tournamentId,
  matchId,
  open,
  onOpenChange,
}: RegisterMatchGoalsDrawerProps) => {
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
            <MatchStatusBar
              match={match}
              readOnly={readOnly}
              isSimulating={isSimulating}
              isSaving={isSaving}
              onSimulate={handleSimulate}
            />
          )}
        </SheetHeader>

        {!isPending && match && (
          <form
            id="register-match-goals-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-4"
          >
            <MatchScoreStrip
              match={match}
              homeGoals={homeArray.fields.length}
              awayGoals={awayArray.fields.length}
            />

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
};
