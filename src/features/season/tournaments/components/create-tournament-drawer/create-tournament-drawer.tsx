import { PlusIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Button,
  FieldGroup,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  StatusLine,
  Stepper,
} from '@/components';
import {
  CREATE_TOURNAMENT_STEPS,
  type CreateTournamentStepId,
  useCreateTournamentDrawer,
} from '../../hooks';
import { FormatStep } from './format-step';
import { InfoStep } from './info-step';
import { RosterStep } from './roster-step';

type CreateTournamentDrawerProps = {
  seasonId?: string;
  seasonName?: string;
};
export const CreateTournamentDrawer = ({
  seasonId,
  seasonName = '',
}: CreateTournamentDrawerProps) => {
  const {
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
  } = useCreateTournamentDrawer();

  const stepContent: Record<CreateTournamentStepId, ReactNode> = {
    info: <InfoStep register={register} errors={errors} />,
    format: (
      <FormatStep
        control={control}
        errors={errors}
        maxTeamsValue={maxTeamsValue}
        onMaxTeamsChange={(value) => setValue('maxTeams', value)}
      />
    ),
    roster: (
      <RosterStep
        selectedTeams={selectedTeams}
        onSelect={selectTeam}
        onRemove={removeTeam}
        onOwnerChange={changeOwner}
        onSeed={seedFromSquads}
        maxTeams={maxTeamsNumber}
        isMismatch={teamsCountMismatch}
      />
    ),
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
          <span
            className={
              'font-semibold text-accent text-xs uppercase tracking-wide'
            }
          >
            {seasonName}
          </span>

          <SheetTitle className={'font-display text-2xl'}>
            Novo torneio
          </SheetTitle>
          <SheetDescription>
            O torneio fica vinculado à temporada selecionada no momento.
          </SheetDescription>

          <Stepper
            className={'mt-1'}
            steps={CREATE_TOURNAMENT_STEPS}
            currentStepId={currentStep}
            isStepDone={(stepId) => stepCompletion[stepId]}
            isStepUnlocked={(index) => index <= furthestStepIndex}
            onStepClick={goToStep}
          />
        </SheetHeader>

        <form
          id={'create-tournament-form'}
          onSubmit={onSubmit}
          className={'flex-1 overflow-y-auto px-4'}
        >
          <FieldGroup>{stepContent[currentStep]}</FieldGroup>
        </form>

        <SheetFooter className={'flex-row items-center justify-between gap-3'}>
          <StatusLine tone={footStatus.tone} text={footStatus.text} />

          <div className={'flex shrink-0 items-center gap-2'}>
            {!isFirstStep && (
              <Button type={'button'} variant={'outline'} onClick={goBack}>
                Voltar
              </Button>
            )}

            <Button
              type={'submit'}
              form={'create-tournament-form'}
              className={'w-fit'}
              disabled={isSubmitDisabled}
            >
              {submitLabel}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
