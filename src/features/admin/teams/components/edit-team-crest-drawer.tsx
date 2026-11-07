import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
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
  type EditTeamCrestFormValues,
  editTeamCrestSchema,
  type TeamWithRatings,
} from '../api';
import { useUpdateTeam } from '../hooks';

type EditTeamCrestDrawerProps = {
  team: TeamWithRatings;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditTeamCrestDrawer({
  team,
  open,
  onOpenChange,
}: EditTeamCrestDrawerProps) {
  const { mutate, isPending } = useUpdateTeam(team.id);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTeamCrestFormValues>({
    resolver: zodResolver(editTeamCrestSchema),
    values: { crestUrl: team.crestUrl },
  });
  const crestUrl = useWatch({ control, name: 'crestUrl' });

  const onSubmit = (values: EditTeamCrestFormValues) => {
    mutate(
      { crestUrl: values.crestUrl },
      {
        onSuccess: () => {
          toast.success(`Escudo de "${team.name}" atualizado com sucesso.`);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) reset({ crestUrl: team.crestUrl });
        onOpenChange(nextOpen);
      }}
    >
      <SheetContent className={'data-[side=right]:sm:max-w-md'}>
        <SheetHeader>
          <SheetTitle>Editar escudo</SheetTitle>
          <SheetDescription>{team.name}</SheetDescription>
        </SheetHeader>

        <form
          id={'edit-team-crest-form'}
          onSubmit={handleSubmit(onSubmit)}
          className={'flex flex-1 flex-col gap-4 overflow-y-auto px-4'}
        >
          <div className={'flex items-center justify-center py-2'}>
            <img
              src={crestUrl || team.crestUrl}
              alt={team.name}
              className={'size-24 object-contain'}
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden';
              }}
              onLoad={(event) => {
                event.currentTarget.style.visibility = 'visible';
              }}
            />
          </div>

          <FieldGroup>
            <Field data-invalid={!!errors.crestUrl}>
              <FieldLabel htmlFor={'edit-team-crest-url'}>
                URL do escudo
              </FieldLabel>
              <Input
                id={'edit-team-crest-url'}
                type={'url'}
                placeholder={'https://...'}
                aria-invalid={!!errors.crestUrl}
                {...register('crestUrl')}
              />
              <FieldError
                errors={errors.crestUrl ? [errors.crestUrl] : undefined}
              />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter className={'items-end'}>
          <Button
            type={'submit'}
            form={'edit-team-crest-form'}
            className={'w-fit'}
            disabled={isPending}
          >
            {isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
