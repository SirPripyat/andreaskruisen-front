import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Controller, useForm } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui';
import { type CreateUserFormValues, createUserSchema } from '../api';

type CreateUserFormProps = {
  onSubmit: (values: CreateUserFormValues) => void;
};

export const CreateUserForm = ({ onSubmit }: CreateUserFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', pin: '' },
  });

  return (
    <form
      id="create-user-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 overflow-y-auto px-4"
    >
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="user-name">Nome</FieldLabel>
          <Input
            id="user-name"
            type="text"
            autoComplete="off"
            placeholder="ex.: j.silva"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Field data-invalid={!!errors.pin}>
          <FieldLabel htmlFor="user-pin">PIN</FieldLabel>
          <Controller
            name="pin"
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
          <FieldError errors={errors.pin ? [errors.pin] : undefined} />
        </Field>
      </FieldGroup>
    </form>
  );
};
