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
import { useEditNationalityDrawer } from '../hooks';

type EditNationalityDrawerProps = {
  id: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditNationalityDrawer = ({
  id,
  open,
  onOpenChange,
}: EditNationalityDrawerProps) => {
  const {
    nationality,
    register,
    handleSubmit,
    reset,
    onSubmit,
    flagUrl,
    errors,
    isPending,
  } = useEditNationalityDrawer({ id, open, onOpenChange });

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
          <SheetTitle>Editar nacionalidade</SheetTitle>
          <SheetDescription>{nationality?.name}</SheetDescription>
        </SheetHeader>

        <form
          id={'edit-nationality-form'}
          onSubmit={handleSubmit(onSubmit)}
          className={'flex flex-1 flex-col gap-4 overflow-y-auto px-4'}
        >
          <div className={'flex items-center justify-center py-2'}>
            <img
              src={flagUrl || nationality?.flagUrl}
              alt={nationality?.name}
              className={'h-16 w-24 object-contain'}
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden';
              }}
              onLoad={(event) => {
                event.currentTarget.style.visibility = 'visible';
              }}
            />
          </div>

          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor={'edit-nationality-name'}>Nome</FieldLabel>
              <Input
                id={'edit-nationality-name'}
                type={'text'}
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.flagUrl}>
              <FieldLabel htmlFor={'edit-nationality-flag-url'}>
                URL da bandeira
              </FieldLabel>
              <Input
                id={'edit-nationality-flag-url'}
                type={'url'}
                placeholder={'https://...'}
                aria-invalid={!!errors.flagUrl}
                {...register('flagUrl')}
              />
              <FieldError
                errors={errors.flagUrl ? [errors.flagUrl] : undefined}
              />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter className={'items-end'}>
          <Button
            type={'submit'}
            form={'edit-nationality-form'}
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
