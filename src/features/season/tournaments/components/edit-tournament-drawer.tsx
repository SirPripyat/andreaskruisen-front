import { Controller } from 'react-hook-form';
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
} from '@/components/ui';
import { useEditTournamentDrawer } from '../hooks';
import { TournamentFormatPicker } from './tournament-format-picker';

export const EditTournamentDrawer = ({
  id,
  open,
  onOpenChange,
}: {
  id: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    onSubmit,
    errors,
    isPending,
  } = useEditTournamentDrawer({ id, open, onOpenChange });

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
      }}
    >
      <SheetContent className={'data-[side=right]:sm:max-w-md'}>
        <SheetHeader>
          <SheetTitle>{'Editar torneio'}</SheetTitle>
          <SheetDescription>
            {'Os times já vinculados não são afetados por essa edição.'}
          </SheetDescription>
        </SheetHeader>

        <form
          id={'edit-tournament-form'}
          onSubmit={handleSubmit(onSubmit)}
          className={'flex-1 overflow-y-auto px-4'}
        >
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor={'edit-tournament-name'}>{'Nome'}</FieldLabel>
              <Input
                id={'edit-tournament-name'}
                type={'text'}
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.format || !!errors.maxTeams}>
              <FieldLabel>{'Formato & vagas'}</FieldLabel>
              <Controller
                name={'format'}
                control={control}
                render={({ field: formatField }) => (
                  <Controller
                    name={'maxTeams'}
                    control={control}
                    render={({ field: maxTeamsField }) => (
                      <TournamentFormatPicker
                        format={formatField.value}
                        onFormatChange={(value) => {
                          formatField.onChange(value);
                          setValue('maxTeams', '');
                        }}
                        maxTeams={maxTeamsField.value}
                        onMaxTeamsChange={maxTeamsField.onChange}
                        error={errors.maxTeams?.message}
                      />
                    )}
                  />
                )}
              />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter className={'items-end'}>
          <Button
            type={'submit'}
            form={'edit-tournament-form'}
            className={'w-fit'}
            disabled={isPending}
          >
            {isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
