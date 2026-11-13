import { PlusIcon } from 'lucide-react';
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
import { cn } from '@/lib';
import { useCreateSeasonDrawer } from '../hooks';
import { SeasonCount } from './season-count';
import { SeasonSquadSelectProgress } from './season-squad-select-progress';
import { SelectSeasonSquads } from './select-season-squads';

export const CreateSeasonDrawer = () => {
  const {
    open,
    toggleOpen,
    handleSubmit,
    onSubmit,
    errors,
    register,
    users,
    squads,
    assignTeam,
    unassignTeam,
    isPending,
    progress,
    hasName,
    isComplete,
    usersCount,
    squadsCount,
    errorMessage,
  } = useCreateSeasonDrawer();

  return (
    <Sheet open={open} onOpenChange={toggleOpen}>
      <SheetTrigger
        render={
          <Button>
            <PlusIcon />
            Criar temporada
          </Button>
        }
      />
      <SheetContent className="data-[side=right]:sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Nova temporada</SheetTitle>
          <SheetDescription>
            Isola as negociações da liga em um recorte próprio — times e
            jogadores da base seguem intactos.
          </SheetDescription>
        </SheetHeader>

        <form
          id={'create-season-form'}
          onSubmit={handleSubmit(onSubmit)}
          className={'flex-1 overflow-y-auto px-4'}
        >
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor={'season-name'}>Nome</FieldLabel>
              <Input
                id={'season-name'}
                type={'text'}
                placeholder={'ex.: Temporada 2026'}
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field>
              <div className={'flex items-baseline justify-between gap-2'}>
                <FieldLabel>Elenco da liga</FieldLabel>

                <SeasonCount
                  squadsCount={squadsCount}
                  usersCount={usersCount}
                />
              </div>

              <SeasonSquadSelectProgress
                progress={progress}
                isComplete={isComplete}
              />

              <SelectSeasonSquads
                users={users ?? []}
                squads={squads}
                onAssign={assignTeam}
                onUnassign={unassignTeam}
              />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter className="flex-row items-center justify-between">
          <p
            className={cn(
              'text-muted-foreground text-xs',
              !hasName && 'text-destructive',
              hasName && isComplete && 'text-success',
            )}
          >
            {errorMessage}
          </p>

          <Button
            type="submit"
            form="create-season-form"
            className="w-fit"
            disabled={isPending}
          >
            {isPending ? 'Criando...' : 'Criar temporada'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
