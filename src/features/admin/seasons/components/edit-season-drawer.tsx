import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import {
  type CreateSeasonFormValues,
  createSeasonSchema,
  type Season,
} from '../api';
import { useUpdateSeason } from '../hooks';

export function EditSeasonDrawer({
  season,
  open,
  onOpenChange,
}: {
  season: Season;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate, isPending } = useUpdateSeason(season.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSeasonFormValues>({
    resolver: zodResolver(createSeasonSchema),
    defaultValues: { name: season.name },
  });

  const onSubmit = (values: CreateSeasonFormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(`Temporada "${values.name}" atualizada com sucesso.`);
        onOpenChange(false);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar temporada</SheetTitle>
        </SheetHeader>

        <form
          id="edit-season-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4"
        >
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="edit-season-name">Nome</FieldLabel>
              <Input
                id="edit-season-name"
                type="text"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter className="items-end">
          <Button
            type="submit"
            form="edit-season-form"
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
