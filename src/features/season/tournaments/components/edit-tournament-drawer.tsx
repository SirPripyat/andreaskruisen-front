import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
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
} from '@/components/ui';
import {
  type CreateTournamentFormValues,
  createTournamentSchema,
  type Tournament,
} from '../api';
import { useUpdateTournament } from '../hooks';
import { TournamentFormatPicker } from './tournament-format-picker';

export const EditTournamentDrawer = ({
  tournament,
  open,
  onOpenChange,
}: {
  tournament: Tournament;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { mutate, isPending } = useUpdateTournament(tournament.id);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTournamentFormValues>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: tournament.name,
      format: tournament.format,
      maxTeams: String(tournament.maxTeams),
    },
  });

  const onSubmit = (values: CreateTournamentFormValues) => {
    mutate(
      {
        name: values.name,
        format: values.format,
        maxTeams: Number(values.maxTeams),
      },
      {
        onSuccess: () => {
          toast.success(`Torneio "${values.name}" atualizado com sucesso.`);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
