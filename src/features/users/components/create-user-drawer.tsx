import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { type CreateUserFormValues, createUserSchema } from '../api';
import { useCreateUser } from '../hooks';

export function CreateUserDrawer() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateUser();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', pin: '' },
  });

  const onSubmit = (values: CreateUserFormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(`Usuário "${values.name}" criado com sucesso.`);
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset();
        }
      }}
    >
      <SheetTrigger
        render={
          <Button>
            <PlusIcon />
            Criar usuário
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novo usuário</SheetTitle>
          <SheetDescription>
            O usuário poderá entrar na aplicação com o nome e o PIN informados
            abaixo.
          </SheetDescription>
        </SheetHeader>

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
                    id="user-pin"
                    maxLength={4}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    containerClassName="w-full justify-center"
                    aria-invalid={!!errors.pin}
                    className="w-full"
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
          </FieldGroup>
        </form>

        <SheetFooter className="items-end">
          <Button
            type="submit"
            form="create-user-form"
            className="w-fit"
            disabled={isPending}
          >
            {isPending ? 'Criando...' : 'Criar usuário'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
