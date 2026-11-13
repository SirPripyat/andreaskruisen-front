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
import { useEditSeasonDrawer } from '../hooks';

export const EditSeasonDrawer = ({
  id,
  open,
  onOpenChange,
}: {
  id: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { register, reset, handleSubmit, onSubmit, errors, isPending } =
    useEditSeasonDrawer({ id, open, onOpenChange });

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
      }}
    >
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
};
