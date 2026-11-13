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
import { useEditLeagueDrawer } from '../hooks';
import { CountrySelect } from './country-select';

type EditLeagueDrawerProps = {
  id: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditLeagueDrawer = ({
  id,
  open,
  onOpenChange,
}: EditLeagueDrawerProps) => {
  const {
    league,
    register,
    control,
    handleSubmit,
    reset,
    onSubmit,
    logoUrl,
    errors,
    isPending,
  } = useEditLeagueDrawer({ id, open, onOpenChange });

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
          <SheetTitle>Editar liga</SheetTitle>
          <SheetDescription>{league?.name}</SheetDescription>
        </SheetHeader>

        <form
          id={'edit-league-form'}
          onSubmit={handleSubmit(onSubmit)}
          className={'flex flex-1 flex-col gap-4 overflow-y-auto px-4'}
        >
          {(logoUrl || league?.logoUrl) && (
            <div className={'flex items-center justify-center py-2'}>
              <img
                src={logoUrl || (league?.logoUrl as string)}
                alt={league?.name}
                className={'h-16 w-24 rounded-md bg-white object-contain p-2'}
                onError={(event) => {
                  event.currentTarget.style.visibility = 'hidden';
                }}
                onLoad={(event) => {
                  event.currentTarget.style.visibility = 'visible';
                }}
              />
            </div>
          )}

          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor={'edit-league-name'}>Nome</FieldLabel>
              <Input
                id={'edit-league-name'}
                type={'text'}
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.logoUrl}>
              <FieldLabel htmlFor={'edit-league-logo-url'}>
                URL do logo
              </FieldLabel>
              <Input
                id={'edit-league-logo-url'}
                type={'url'}
                placeholder={'https://...'}
                aria-invalid={!!errors.logoUrl}
                {...register('logoUrl')}
              />
              <FieldError
                errors={errors.logoUrl ? [errors.logoUrl] : undefined}
              />
            </Field>

            <Field>
              <FieldLabel>País</FieldLabel>
              <Controller
                name={'country'}
                control={control}
                render={({ field }) => (
                  <CountrySelect
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter className={'items-end'}>
          <Button
            type={'submit'}
            form={'edit-league-form'}
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
