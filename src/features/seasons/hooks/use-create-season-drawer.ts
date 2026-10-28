import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { TeamWithRatings } from '@/features/teams';
import { useUsers } from '@/features/users';
import { type CreateSeasonFormValues, createSeasonSchema } from '../api';
import { useCreateSeason } from './use-create-season';

export const useCreateSeasonDrawer = () => {
  const [open, setOpen] = useState(false);
  const [squads, setSquads] = useState<Map<string, TeamWithRatings>>(new Map());

  const { data: users } = useUsers({ enabled: open });
  const { mutate, isPending } = useCreateSeason();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateSeasonFormValues>({
    resolver: zodResolver(createSeasonSchema),
    defaultValues: { name: '' },
  });

  const name = watch('name');

  const toggleOpen = () => setOpen((prevState) => !prevState);

  const assignTeam = (userId: string, team: TeamWithRatings) => {
    setSquads((current) => new Map(current).set(userId, team));
  };

  const unassignTeam = (userId: string) => {
    setSquads((current) => {
      const next = new Map(current);
      next.delete(userId);
      return next;
    });
  };

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
          toggleOpen();
        },
      },
    );
  };

  return {
    open,
    toggleOpen,
    handleSubmit,
    onSubmit,
    errors,
    register,
    name,
    users,
    squads,
    assignTeam,
    unassignTeam,
    isPending,
  };
};
