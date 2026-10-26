import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ArrowRightIcon, UserIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
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
  InputOTPSlot,
} from '@/components/ui';
import { getErrorMessage } from '@/lib';
import { type LoginFormValues, loginSchema } from './api';
import { useLogin } from './hooks';

export function LoginScreen() {
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: '', pin: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutate(values, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (err) => {
        toast.error(
          getErrorMessage(err, 'Não foi possível entrar. Tente novamente.'),
        );
      },
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <aside className="flex items-center justify-start gap-3 bg-[var(--p-ink-950)] px-5 py-6 md:w-[40%] md:min-w-[280px] md:flex-col md:justify-center md:gap-4 md:px-10 md:py-10">
        <img
          src="/logo-flagband-square.svg"
          alt="Andreaskruisen"
          className="h-10 w-10 md:h-16 md:w-16"
        />
        <h1 className="text-balance font-display text-xl leading-none font-extrabold text-[var(--p-mist-100)] md:text-center md:text-4xl">
          Andreaskruisen
        </h1>
      </aside>

      <div className="flex flex-1 items-center justify-center bg-background px-5 py-10">
        <div className="w-full max-w-sm">
          <p className="font-mono text-xs font-semibold tracking-wider text-accent uppercase">
            Bem-vindo de volta
          </p>
          <h2 className="mt-2 font-display text-3xl leading-none font-extrabold">
            Entrar
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Informe seu usuário e PIN para acessar a aplicação.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="username">Usuário</FieldLabel>
                <div className="relative flex items-center">
                  <UserIcon className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="ex.: j.silva"
                    aria-invalid={!!errors.name}
                    className="pl-8"
                    {...register('name')}
                  />
                </div>
                <FieldError errors={errors.name ? [errors.name] : undefined} />
              </Field>

              <Field data-invalid={!!errors.pin}>
                <FieldLabel htmlFor="pin">PIN</FieldLabel>
                <Controller
                  name="pin"
                  control={control}
                  render={({ field }) => (
                    <InputOTP
                      id="pin"
                      maxLength={4}
                      pattern={REGEXP_ONLY_DIGITS}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      containerClassName="w-full justify-center"
                      aria-invalid={!!errors.pin}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="size-13 font-mono text-lg"
                        />
                        <InputOTPSlot
                          index={1}
                          className="size-13 font-mono text-lg"
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={2}
                          className="size-13 font-mono text-lg"
                        />
                        <InputOTPSlot
                          index={3}
                          className="size-13 font-mono text-lg"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                <FieldError errors={errors.pin ? [errors.pin] : undefined} />
              </Field>

              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
                size="lg"
              >
                {isPending ? (
                  'Entrando...'
                ) : (
                  <>
                    Entrar
                    <ArrowRightIcon />
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
