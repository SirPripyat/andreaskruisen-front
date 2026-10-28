import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { UserIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
} from '@/components/ui';
import { useLoginForm } from '../hooks';
import { LoginInputOtpSlot } from './login-input-otp-slot';

export const LoginForm = () => {
  const { handleSubmit, onSubmit, errors, register, control, isPending } =
    useLoginForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor={'username'}>Usuário</FieldLabel>
          <div className={'relative flex items-center'}>
            <UserIcon
              className={
                'pointer-events-none absolute left-2.5 size-4 text-muted-foreground'
              }
            />
            <Input
              id={'username'}
              type={'text'}
              autoComplete={'username'}
              placeholder={'ex.: silva'}
              aria-invalid={!!errors.name}
              className={'pl-8'}
              {...register('name')}
            />
          </div>
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Field data-invalid={!!errors.pin}>
          <FieldLabel htmlFor={'pin'}>PIN</FieldLabel>
          <Controller
            name={'pin'}
            control={control}
            render={({ field }) => (
              <InputOTP
                id={'pin'}
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                containerClassName={'w-full justify-center'}
                aria-invalid={!!errors.pin}
                className={'w-full'}
              >
                <InputOTPGroup className={'w-full'}>
                  <LoginInputOtpSlot index={0} />
                  <LoginInputOtpSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator
                  className={'ml-1 mr-1 text-muted-foreground'}
                />
                <InputOTPGroup className={'w-full'}>
                  <LoginInputOtpSlot index={2} />
                  <LoginInputOtpSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          <FieldError errors={errors.pin ? [errors.pin] : undefined} />
        </Field>

        <Button
          type={'submit'}
          className={'w-full'}
          disabled={isPending}
          size={'lg'}
        >
          {isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </FieldGroup>
    </form>
  );
};
