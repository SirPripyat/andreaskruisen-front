import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
  SheetTrigger,
} from '@/components/ui';
import type { TeamWithRatings } from '@/features/teams';
import { useUsers } from '@/features/users';
import { type CreateSeasonFormValues, createSeasonSchema } from '../api';
import { useCreateSeason } from '../hooks';
import { SelectSeasonSquads } from './select-season-squads';

export function CreateSeasonDrawer() {
  const [open, setOpen] = useState(false);
  const [squads, setSquads] = useState<Map<string, TeamWithRatings>>(new Map());
  const { data: users } = useUsers({ enabled: open });
  const { mutate, isPending } = useCreateSeason();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSeasonFormValues>({
    resolver: zodResolver(createSeasonSchema),
    defaultValues: { name: '' },
  });

  function assignTeam(userId: string, team: TeamWithRatings) {
    setSquads((current) => new Map(current).set(userId, team));
  }

  function unassignTeam(userId: string) {
    setSquads((current) => {
      const next = new Map(current);
      next.delete(userId);
      return next;
    });
  }

  const onSubmit = (values: CreateSeasonFormValues) => {
    mutate(
      {
        name: values.name,
        squads: Array.from(squads.entries()).map(([userId, team]) => ({
          userId,
          teamId: team.id,
        })),
      },
      {
        onSuccess: (season) => {
          toast.success(`Temporada "${season.name}" criada com sucesso.`);
          reset();
          setSquads(new Map());
          setOpen(false);
        },
      },
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset();
          setSquads(new Map());
        }
      }}
    >
      <SheetTrigger
        render={
          <Button>
            <PlusIcon />
            Criar temporada
          </Button>
        }
      />
      <SheetContent className="data-[side=right]:sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Nova temporada</SheetTitle>
          <SheetDescription>
            Uma temporada isola as negociações entre clubes sem afetar a base
            original de times e jogadores.
          </SheetDescription>
        </SheetHeader>

        <form
          id="create-season-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4"
        >
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="season-name">Nome</FieldLabel>
              <Input
                id="season-name"
                type="text"
                placeholder="ex.: Temporada 2026"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field>
              <FieldLabel>Times dos usuários</FieldLabel>
              <SelectSeasonSquads
                users={users ?? []}
                squads={squads}
                onAssign={assignTeam}
                onUnassign={unassignTeam}
              />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter className="items-end">
          <Button
            type="submit"
            form="create-season-form"
            className="w-fit"
            disabled={isPending}
          >
            {isPending ? 'Criando...' : 'Criar temporada'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
