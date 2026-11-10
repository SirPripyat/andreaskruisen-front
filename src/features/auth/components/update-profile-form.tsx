import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Controller } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui';
import type { Me } from '../api';
import { useUpdateProfileForm } from '../hooks';
import { AvatarUpload } from './avatar-upload';

type UpdateProfileFormProps = {
  me: Me;
};

export const UpdateProfileForm = ({ me }: UpdateProfileFormProps) => {
  const { register, control, handleSubmit, onSubmit, errors, isPending } =
    useUpdateProfileForm(me);

  return (
    <Card className={'w-full max-w-md'}>
      <CardHeader>
        <CardTitle>Dados de acesso</CardTitle>
        <CardDescription>
          Essas informações são usadas para entrar na aplicação.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id={'update-profile-form'} onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className={'flex justify-center'}>
              <AvatarUpload name={me.name} />
            </div>

            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor={'profile-name'}>Nome</FieldLabel>
              <Input
                id={'profile-name'}
                type={'text'}
                autoComplete={'off'}
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.pin}>
              <FieldLabel htmlFor={'profile-pin'}>Novo PIN</FieldLabel>
              <Controller
                name={'pin'}
                control={control}
                render={({ field }) => (
                  <InputOTP
                    id={'profile-pin'}
                    maxLength={4}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    containerClassName={'w-full justify-center'}
                    aria-invalid={!!errors.pin}
                    className={'w-full'}
                  >
                    <InputOTPGroup className={'w-full'}>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup className={'w-full'}>
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
              <FieldDescription>
                Deixe em branco para manter o PIN atual.
              </FieldDescription>
              <FieldError errors={errors.pin ? [errors.pin] : undefined} />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className={'justify-end'}>
        <Button
          type={'submit'}
          form={'update-profile-form'}
          disabled={isPending}
        >
          {isPending ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </CardFooter>
    </Card>
  );
};
