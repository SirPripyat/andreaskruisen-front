import { zodResolver } from '@hookform/resolvers/zod';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { type Path, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useStepNavigation } from '@/hooks';
import {
  type CreateTournamentFormValues,
  createTournamentSchema,
} from '../types';
import { useCreateTournament } from './use-create-tournament';
import { useTournamentRoster } from './use-tournament-roster';

export const CREATE_TOURNAMENT_STEPS = [
  { id: 'info', label: 'Informações' },
  { id: 'format', label: 'Formato & vagas' },
  { id: 'roster', label: 'Elenco' },
] as const;

export type CreateTournamentStepId =
  (typeof CREATE_TOURNAMENT_STEPS)[number]['id'];

const STEP_FIELDS: Record<
  CreateTournamentStepId,
  Path<CreateTournamentFormValues>[]
> = {
  info: ['name'],
  format: ['format', 'maxTeams'],
  roster: [],
};

const getSubmitLabel = (isLastStep: boolean, isSubmitting: boolean) => {
  if (!isLastStep) return 'Avançar';
  if (isSubmitting) return 'Criando...';
  return 'Criar torneio';
};

type FootStatus = { tone: 'ok' | 'warn'; text: string };

const getFootStatus = ({
  hasName,
  maxTeamsNumber,
  teamsCountMismatch,
  selectedTeamsCount,
}: {
  hasName: boolean;
  maxTeamsNumber: number | undefined;
  teamsCountMismatch: boolean;
  selectedTeamsCount: number;
}): FootStatus => {
  if (!hasName) {
    return { tone: 'warn', text: 'Dê um nome ao torneio para continuar.' };
  }
  if (maxTeamsNumber === undefined) {
    return { tone: 'warn', text: 'Escolha a quantidade de times.' };
  }
  if (teamsCountMismatch) {
    const diff = maxTeamsNumber - selectedTeamsCount;
    return {
      tone: 'warn',
      text:
        diff > 0
          ? `Faltam ${diff} time${diff === 1 ? '' : 's'} para completar o elenco.`
          : `Remova ${-diff} time${-diff === 1 ? '' : 's'} para encaixar no formato.`,
    };
  }
  return { tone: 'ok', text: 'Elenco completo — pronto para criar o torneio.' };
};

export const useCreateTournamentDrawer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending: isCreating } = useCreateTournament();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateTournamentFormValues>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: { name: '', format: 'LEAGUE', maxTeams: '' },
  });
  const name = useWatch({ control, name: 'name' });
  const maxTeamsValue = useWatch({ control, name: 'maxTeams' });

  const {
    currentStep,
    furthestStepIndex,
    goToStep,
    goBack,
    goNext,
    resetSteps,
    isFirstStep,
    isLastStep,
  } = useStepNavigation(CREATE_TOURNAMENT_STEPS, (step) =>
    trigger(STEP_FIELDS[step]),
  );

  const {
    selectedTeams,
    selectTeam,
    removeTeam,
    changeOwner,
    linkOwners,
    isLinkingTeams,
    resetRoster,
    seedFromSquads,
  } = useTournamentRoster();

  const maxTeamsNumber = maxTeamsValue ? Number(maxTeamsValue) : undefined;
  const teamsCountMismatch =
    maxTeamsNumber !== undefined && selectedTeams.size !== maxTeamsNumber;

  const hasName = name.trim().length > 0;
  const rosterComplete =
    maxTeamsNumber !== undefined && selectedTeams.size === maxTeamsNumber;

  const stepCompletion: Record<CreateTournamentStepId, boolean> = {
    info: hasName,
    format: maxTeamsNumber !== undefined,
    roster: rosterComplete,
  };

  const submitTournament = (values: CreateTournamentFormValues) => {
    if (teamsCountMismatch) {
      toast.error(
        `Selecione exatamente ${maxTeamsNumber} time${maxTeamsNumber === 1 ? '' : 's'} (atualmente ${selectedTeams.size}).`,
      );
      return;
    }

    const entries = Array.from(selectedTeams.values());

    return mutateAsync({
      name: values.name,
      format: values.format,
      maxTeams: Number(values.maxTeams),
      teamIds: entries.map(({ team }) => team.id),
    })
      .then((created) =>
        linkOwners(created.seasonId, entries).then(() => created),
      )
      .then((created) => {
        toast.success(`Torneio "${created.name}" criado com sucesso.`);
        reset();
        resetRoster();
        resetSteps();
        setOpen(false);
        navigate(`/tournaments/${created.id}`);
      });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (isLastStep) return handleSubmit(submitTournament)(event);

    event.preventDefault();
    goNext();
  };

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
      resetRoster();
      resetSteps();
    }
  };

  const isSubmitting = isCreating || isLinkingTeams;
  const submitLabel = getSubmitLabel(isLastStep, isSubmitting);
  const isSubmitDisabled =
    isLastStep &&
    (isSubmitting || maxTeamsNumber === undefined || teamsCountMismatch);

  const footStatus = getFootStatus({
    hasName,
    maxTeamsNumber,
    teamsCountMismatch,
    selectedTeamsCount: selectedTeams.size,
  });

  return {
    open,
    onOpenChange,
    register,
    control,
    setValue,
    errors,
    onSubmit,
    selectedTeams,
    selectTeam,
    removeTeam,
    changeOwner,
    seedFromSquads,
    maxTeamsValue,
    maxTeamsNumber,
    teamsCountMismatch,
    currentStep,
    goToStep,
    goBack,
    isFirstStep,
    furthestStepIndex,
    stepCompletion,
    footStatus,
    submitLabel,
    isSubmitDisabled,
  };
};
