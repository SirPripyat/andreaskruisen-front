import { zodResolver } from '@hookform/resolvers/zod';
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
} from '@/components/ui';
import {
  type CreateTournamentFormValues,
  createTournamentSchema,
  TEAM_COUNT_RULES,
  TOURNAMENT_FORMAT_LABELS,
  TOURNAMENT_FORMATS,
  type Tournament,
} from '../api';
import { useUpdateTournament } from '../hooks';

export function EditTournamentDrawer({
  tournament,
  open,
  onOpenChange,
}: {
  tournament: Tournament;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
  const format = useWatch({ control, name: 'format' });
  const formatRule = TEAM_COUNT_RULES[format];

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
      <SheetContent className="data-[side=right]:sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Editar torneio</SheetTitle>
          <SheetDescription>
            Os times já vinculados não são afetados por essa edição.
          </SheetDescription>
        </SheetHeader>

        <form
          id="edit-tournament-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4"
        >
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="edit-tournament-name">Nome</FieldLabel>
              <Input
                id="edit-tournament-name"
                type="text"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.format}>
                <FieldLabel htmlFor="edit-tournament-format">
                  Formato
                </FieldLabel>
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
                        id="edit-tournament-format"
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
                <FieldLabel htmlFor="edit-tournament-max-teams">
                  Qtd máx de times
                </FieldLabel>
                <Controller
                  name="maxTeams"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="edit-tournament-max-teams"
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
                <FieldError
                  errors={errors.maxTeams ? [errors.maxTeams] : undefined}
                />
              </Field>
            </div>
          </FieldGroup>
        </form>

        <SheetFooter className="items-end">
          <Button
            type="submit"
            form="edit-tournament-form"
            className="w-fit"
            disabled={isPending}
          >
            {isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
