import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import type { CreateUserFormValues } from '../api';
import { useCreateUser } from '../hooks';
import { CreateUserForm } from './create-user-form';

export function CreateUserDrawer() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateUser();

  const toggleOpen = () => setOpen((prevState) => !prevState);

  const onSubmit = (values: CreateUserFormValues) =>
    mutate(values, {
      onSuccess: () => {
        toast.success(`Usuário "${values.name}" criado com sucesso.`);
        toggleOpen();
      },
    });

  return (
    <Sheet open={open} onOpenChange={toggleOpen}>
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

        <CreateUserForm onSubmit={onSubmit} />

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
