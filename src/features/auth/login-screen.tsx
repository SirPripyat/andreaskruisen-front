import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  InputOTP,
  InputOTPGroup,
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
      <div className={'flex gap-1 items-end'}>
        <img
          src="/logo-flagband-square.svg"
          alt="Andreaskruisen"
          className="h-12 w-12"
        />
        <h1 className={'font-display text-4xl'}>Andreaskruisen</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Entrar</CardTitle>
          <CardDescription>
            Informe seu usuário e PIN para acessar a aplicação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="username">Usuário</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  aria-invalid={!!errors.name}
                  {...register('name')}
                />
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
                      containerClassName="w-full"
                    >
                      <InputOTPGroup className="w-full">
                        <InputOTPSlot index={0} className="h-10 flex-1" />
                        <InputOTPSlot index={1} className="h-10 flex-1" />
                        <InputOTPSlot index={2} className="h-10 flex-1" />
                        <InputOTPSlot index={3} className="h-10 flex-1" />
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
                size={'lg'}
              >
                {isPending ? 'Entrando...' : 'Entrar'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
